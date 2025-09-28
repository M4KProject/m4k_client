import { Coll, CollOptions, Where } from '@common/api/Coll';
import { ModelBase, ModelCreate, ModelUpdate } from '@common/api/models.base';
import { byId } from '@common/utils/by';
import { isItemMap, isEmpty, isList, isStr } from '@common/utils/check';
import { notImplemented } from '@common/utils/error';
import {
  DeviceModel,
  GroupModel,
  JobModel,
  MediaModel,
  MemberModel,
  UserModel,
} from '@common/api/models';
import { IMsgReadonly } from '@common/utils/Msg';
import { stringify } from '@common/utils/json';
import { deepClone, getChanges } from '@common/utils/obj';
import { apiError$ } from '@common/api';
import { showError } from '@common/components';
import { TMap } from '@common/utils/types';
import { MsgMap } from '@common/utils/MsgMap';

export class Sync<T extends ModelBase> {
  readonly name: string;
  readonly up$: IMsgReadonly<TMap<T>>;
  readonly coll: Coll<T>;

  private readonly cache: MsgMap<T>;
  private readonly filterMap: TMap<IMsgReadonly<T[]>> = {};
  private readonly findMap: TMap<IMsgReadonly<T>> = {};
  private isInit = false;

  constructor(name: string) {
    this.name = name;
    this.coll = new Coll<T>(name);
    this.cache = new MsgMap<T>({}, name + 'Cache', true, isItemMap);
    this.up$ = this.cache.throttle(100);
  }

  log(...args: any[]) {
    console.debug('Sync', this.name, ...args);
  }

  byId() {
    return this.cache.v;
  }

  filter(where?: Where<T>, one?: boolean) {
    this.log('find', where, one);
    const items = this.cache.getItems();
    if (isEmpty(where)) return items;

    const whereList = isList(where) ? where : [where];

    const filtersList = whereList.map((where) =>
      Object.entries(where).map(([p, filter]) => {
        if (isList(filter)) {
          const [operator, operand] = filter;
          switch (operator) {
            case '=':
              return (v: any) => v[p] === operand;
            case '!=':
              return (v: any) => v[p] !== operand;
            case '>':
              return (v: any) => v[p] > operand;
            case '>=':
              return (v: any) => v[p] >= operand;
            case '<':
              return (v: any) => v[p] < operand;
            case '<=':
              return (v: any) => v[p] <= operand;
            // case '~':   // Like/Contains (if not specified auto wraps the right string OPERAND in a "%" for wildcard match)
            // case '!~':  // NOT Like/Contains (if not specified auto wraps the right string OPERAND in a "%" for wildcard match)
            // case '?=':  // Any/At least one of Equal
            // case '?!=': // Any/At least one of NOT equal
            // case '?>':  // Any/At least one of Greater than
            // case '?>=': // Any/At least one of Greater than or equal
            // case '?<':  // Any/At least one of Less than
            // case '?<=': // Any/At least one of Less than or equal
            // case '?~':  // Any/At least one of Like/Contains (if not specified auto wraps the right string OPERAND in a "%" for wildcard match)
            // case '?!~': // Any/At least one of NOT Like/Contains (if not specified auto wraps the right string OPERAND in a "%" for wildcard match)
            default:
              throw notImplemented(operator);
          }
        } else {
          return (v: any) => v[p] === filter;
        }
      })
    );

    const filter = (i) => filtersList.find((filters) => filters.every((f) => f(i)));

    const results = one ? [items.find(filter)] : items.filter(filter);
    return results;
  }

  get(where?: string | Where<T>) {
    if (!where) return undefined;
    if (isStr(where)) return this.cache.getItem(where);
    return this.filter(where, true)[0];
  }

  async load() {
    this.log('load');
    const items = await this.coll.all();
    const changes: TMap<T | null> = byId(items);
    const prev = this.filter();
    const deletedIds = prev.filter((i) => !changes[i.id]).map((r) => r.id);
    for (const id of deletedIds) changes[id] = null;
    this.cache.update(changes);
  }

  init() {
    if (!this.isInit) {
      this.isInit = true;
      this.log('init');
      this.coll.on((item, action) => {
        this.set(item.id, action === 'delete' ? null : item);
      });
      this.load();
    }
  }

  filter$(where?: Where<T>) {
    this.init();
    const key = isStr(where) ? where : stringify(where);
    const map = this.filterMap;
    return map[key] || (map[key] = this.cache.map(() => this.filter(where)));
  }

  find$(where?: string | Where<T>) {
    this.init();
    const key = isStr(where) ? where : stringify(where);
    const map = this.findMap;
    return map[key] || (map[key] = this.cache.map(() => this.get(where)));
  }

  private set(id: string, item: T | null) {
    this.cache.setItem(id, item);
  }

  async create(item: ModelCreate<T>, o?: CollOptions<T>): Promise<T> {
    this.log('create', item, o);
    const result = await this.coll.create(item, o);
    this.set(result.id, result);
    return result;
  }

  async update(id: string, changes: ModelUpdate<T>, o?: CollOptions<T>): Promise<T | null> {
    const prev = this.get(id);
    this.set(id, { ...prev, ...changes });
    try {
      const result = await this.coll.update(id, changes, o);
      const next = { ...prev, ...changes, ...result };
      this.set(id, next);
      return next;
    } catch (e) {
      this.set(id, prev);
      throw e;
    }
  }

  async apply(id: string, cb: (next: T) => void, o?: CollOptions<T>): Promise<T | null> {
    const prev = this.get(id);
    const next = deepClone(prev);
    cb(next);
    const changes = getChanges(prev, next);
    if (isEmpty(changes)) return prev;
    this.set(id, next);
    try {
      const result = await this.coll.update(id, changes, o);
      const next2 = { ...next, ...result };
      this.set(id, next2);
      return next2;
    } catch (e) {
      this.set(id, prev);
      throw e;
    }
  }

  async delete(id: string, o?: CollOptions<T>): Promise<void> {
    const prev = this.get(id);
    this.set(id, null);
    try {
      await this.coll.delete(id, o);
    } catch (e) {
      this.set(id, prev);
      throw e;
    }
  }
}

export const sync = <T extends ModelBase>(name: string) => new Sync<T>(name);

export const deviceSync = sync<DeviceModel>('devices');
export const groupSync = sync<GroupModel>('groups');
export const jobSync = sync<JobModel>('jobs');
export const mediaSync = sync<MediaModel>('medias');
export const memberSync = sync<MemberModel>('members');
export const userSync = sync<UserModel>('users');

apiError$.on(showError);
