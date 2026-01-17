import { ApiClient } from "./ApiClient";
import { ApiRest } from "./ApiRest";
import { ModelBase } from "./models";
import { byId, Dictionary, fluxStored, isDictionaryOfItem, Listener, SECOND } from 'fluxio';

export class ApiSync<T extends ModelBase> extends ApiRest<T> {
  byId$ = fluxStored<Dictionary<T>>(this.name+'ById', {}, isDictionaryOfItem);
  items$ = this.byId$.map(byId => Object.values(byId));
  byKey$ = this.items$.map(items => {
    const byKey: Dictionary<T> = {};
    for (const item of items) {
      byKey[item.id] = item;
    }
    for (const item of items) {
      if ((item as any).key) {
        byKey[(item as any).key] = item;
      }
    }
    return byKey;
  });

  constructor(client: ApiClient, name: string) {
    super(client, name);

    this.byId$.onListeners = this.onListeners;
    this.client.groupId$.on(() => this.load());
    this.load();
  }

  onListeners(thens: Listener<Dictionary<T>>[], catches: Listener<Error>[]) {
    if (thens.length > 0) {
      this.startPool();
    } else {
      this.stopPool();
    }
  }

  _pool?: any;

  startPool() {
    if (this._pool) return;
    this._pool = setInterval(() => this.load(), 10 * SECOND);
    this.load();
  }

  stopPool() {
    if (!this._pool) return;
    clearInterval(this._pool);
  }

  async load() {
    if (document.hidden) return;
    const items = await this.list();
    this.byId$.set(byId(items));
  }

  getByKey(key: string) {
    const byKey = this.byKey$.get();
    return byKey[key];
  }

  apply(id: string, next: (prev: T) => void) {
    const item = this.byId$.get()[id];
    if (!item) return;
    next(item);
  }
}