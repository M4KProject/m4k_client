import { PbColl, PbOptions, PbWhere, PbModel, PbCreate, PbUpdate, PbAuthColl } from 'pblite';
import {
  byId,
  fluxDictionary,
  fluxStored,
  isDictionary,
  isItem,
  keepIf,
  logger,
  Logger,
} from 'fluxio';
import { isEmpty, isArray, isString } from 'fluxio';
import { notImplemented } from 'fluxio/error';
import { Flux } from 'fluxio';
import { jsonStringify } from 'fluxio';
import { deepClone, getChanges } from 'fluxio';
import { Dictionary } from 'fluxio';
import { FluxDictionary } from 'fluxio';
import { firstUpper } from 'fluxio';
import { ItemId } from './models';

export type IdOrWhere<T extends PbModel> = string | PbWhere<T>;

const filter = <T extends PbModel>(items: T[], where?: PbWhere<T>, one?: boolean) => {
  if (isEmpty(where)) return items;

  const whereList = isArray(where) ? where : [where];

  const filtersList = whereList.map((where) =>
    Object.entries(where || {}).map(([p, filter]) => {
      if (isArray(filter)) {
        const [operator, operand] = filter;
        switch (operator) {
          case '=':
            return (v: any) => v[p] === (operand ?? null);
          case '!=':
            return (v: any) => v[p] !== (operand ?? null);
          case '>':
            return (v: any) => v[p] > (operand ?? null);
          case '>=':
            return (v: any) => v[p] >= (operand ?? null);
          case '<':
            return (v: any) => v[p] < (operand ?? null);
          case '<=':
            return (v: any) => v[p] <= (operand ?? null);
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

  const filter = (i: T) => filtersList.find((filters) => filters.every((f) => f(i)));

  let results = one ? [items.find(filter)] : items.filter(filter);
  results = results.filter((item): item is T => item !== undefined);

  return results as T[];
};

export const getId = (itemId: ItemId) => (isItem(itemId) ? itemId.id : itemId);

export class Sync<T extends PbModel> {
  readonly log: Logger;
  readonly name: string;
  readonly up$: Flux<Dictionary<T>>;
  readonly coll: PbColl<T>;

  private readonly cache: FluxDictionary<T>;
  private readonly filterMap: Dictionary<Flux<T[]>> = {};
  private readonly findMap: Dictionary<Flux<T>> = {};
  private isInit = false;

  constructor(name: string) {
    this.log = logger(firstUpper(name).replace(/s$/, '') + 'Sync');
    this.name = name;
    this.coll = new PbColl<T>(name);
    this.cache = fluxDictionary<T>(
      fluxStored(name + 'Cache$', {}, isDictionary, (items) =>
        keepIf(items, (item) => isItem(item) && isString(item.id))
      )
    );

    // const values =
    // for (const key in this.cache) {
    //   const item = this.cache[key];
    //   if (!isItem(item)) delete this.cache[key];
    // }

    this.up$ = this.cache.throttle(100);

    this.cache.on((next) => this.log.d('cache next', { next }));
    this.up$.on((next) => this.log.d('up$ next', { next }));
  }

  byId() {
    return this.cache.get();
  }

  filter(where?: PbWhere<T>, one?: boolean): T[] {
    const results = filter(this.cache.getItems(), where, one);
    this.log.d('filter results', { where, one, results });
    return results;
  }

  get(where?: IdOrWhere<T>) {
    const result = isString(where) ? this.cache.getItem(where) : this.filter(where, true)[0];
    this.log.d('get', { where, result });
    return result;
  }

  async load(reset = false) {
    this.log.d('loading', { reset });
    const items = await this.coll.all();
    const changes: Dictionary<T | null> = byId(items);
    if (!reset) {
      const prev = this.filter();
      const deletedIds = prev.filter((i) => i && !changes[i.id]).map((r) => r!.id);
      for (const id of deletedIds) changes[id] = null;
    }
    this.cache.update(changes as Dictionary<T>);
    this.log.d('loaded', { reset, items, changes });
  }

  init() {
    if (!this.isInit) {
      this.isInit = true;
      this.log.d('init');
      this.coll.on((item, action) => {
        this.set(item.id, action === 'delete' ? null : item);
      });
      this.load();
    }
  }

  filter$(where?: PbWhere<T>): Flux<T[]> {
    const key = isString(where) ? where : jsonStringify(where);
    this.log.d('filter$', { where, key });
    this.init();

    const cache = this.filterMap;
    const prev = cache[key];
    if (prev) return prev;

    this.log.d('find$ new', { where, key });
    return (cache[key] = this.up$.map(() => this.filter(where)));
  }

  find$(where?: IdOrWhere<T>): Flux<T> {
    const key = isString(where) ? where : jsonStringify(where);
    this.log.d('find$', { where, key });
    this.init();

    const cache = this.findMap;
    const prev = cache[key];
    if (prev) return prev;

    this.log.d('find$ new', { where, key });
    return (cache[key] = this.up$.map(() => this.get(where) as T));
  }

  private set(id: string, item: T | null) {
    this.cache.setItem(id, item as T | undefined);
  }

  async create(item: PbCreate<T>, o?: PbOptions<T>): Promise<T> {
    this.log.d('create', item, o);
    const result = await this.coll.create(item, o);
    this.set(result.id, result);
    return result;
  }

  async update(itemId: ItemId, changes: PbUpdate<T>, o?: PbOptions<T>): Promise<T | null> {
    const id = getId(itemId);
    this.log.d('update', id, changes, o);
    const prev = this.get(id);
    if (!prev) return null;
    this.set(id, { ...prev, ...changes } as T);
    try {
      const result = await this.coll.update(id, changes, o);
      const next = { ...prev, ...changes, ...result } as T;
      this.set(id, next);
      return next;
    } catch (e) {
      this.set(id, prev);
      throw e;
    }
  }

  async apply(itemId: ItemId, cb: (next: T) => void, o?: PbOptions<T>): Promise<T | null> {
    const id = getId(itemId);
    this.log.d('apply', id, o);
    const prev = this.get(id);
    if (!prev) return null;
    const next = deepClone(prev) as T;
    cb(next);
    const changes = getChanges(prev, next);
    if (isEmpty(changes)) return prev;
    this.set(id, next);
    try {
      const result = await this.coll.update(id, changes as PbUpdate<T>, o);
      const next2 = { ...next, ...result } as T;
      this.set(id, next2);
      return next2;
    } catch (e) {
      this.set(id, prev);
      throw e;
    }
  }

  async delete(itemId?: ItemId, o?: PbOptions<T>): Promise<void> {
    if (!itemId) return;
    const id = getId(itemId);
    this.log.d('delete', id, o);
    const prev = this.get(id);
    this.set(id, null);
    try {
      await this.coll.delete(id, o);
    } catch (e) {
      if (prev) this.set(id, prev);
      throw e;
    }
  }
}

// export const sync = <T extends PbModel>(name: string) => new Sync<T>(name);

// export const deviceSync = sync<DeviceModel>('devices');
// export const groupSync = sync<GroupModel>('groups');
// export const jobSync = sync<JobModel>('jobs');
// export const mediaSync = sync<MediaModel>('medias');
// export const memberSync = sync<MemberModel>('members');
// // export const userSync = sync<UserModel>('users');

// export const applicationColl = new PbColl<ApplicationModel>('applications');
// export const userColl = new PbAuthColl<UserModel>('users');
