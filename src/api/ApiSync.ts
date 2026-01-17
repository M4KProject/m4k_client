import { ApiClient } from "./ApiClient";
import { ApiRest } from "./ApiRest";
import { ModelBase } from "./models";
import { byId, Dictionary, fluxStored, isDictionaryOfItem, SECOND } from 'fluxio';

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
  listenerCount = 0;
  poolInterval: any;

  constructor(client: ApiClient, name: string) {
    super(client, name);
    this.client.groupId$.on(() => this.load());
  }

  on() {
    this.listenerCount++;
    this.changed();
    return () => {
      this.listenerCount--;
      this.changed();
    }
  }

  private changed() {
    if (this.listenerCount <= 0) {
      this.listenerCount = 0;
      clearInterval(this.poolInterval);
      return;
    }
    if (this.listenerCount === 1) {
      this.poolInterval = setInterval(() => this.load(), 10 * SECOND);
      this.load();
    }
  }

  async load() {
    const items = await this.list();
    this.byId$.set(byId(items));
  }

  getByKey(key: string) {
    const byKey = this.byKey$.get();
    return byKey[key];
  }
}