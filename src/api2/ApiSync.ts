// import { ApiClient } from "./ApiClient";
// import { toId } from "./ApiHelpers";
// import { ApiRest } from "./ApiRest";
// import { ItemOrId, ModelBase, ModelCreate, ModelUpdate } from "./models";
// import { byId, deepClone, Dictionary, Flux, fluxDictionary, fluxStored, getChanges, isDictionary, isEmpty, isItem, isString, keepIf, Listener, ReqOptions, SECOND, serverDate, uuid } from 'fluxio';

// const cleanItems = <T>(items: Dictionary<T>) => keepIf(items, (item) => isItem(item) && isString(item.id));

// export class ApiSync<T extends ModelBase> extends ApiRest<T> {
//   data$ = fluxStored<{
//     current: Dictionary<T>,
//     created: Dictionary<T>,
//     updated: Dictionary<T>,
//     removed: Dictionary<T>,
//   }>(this.name+'Local', {}, isDictionary, cleanItems);
//   created$ = fluxStored<Dictionary<T>>(this.name+'Created', {}, isDictionary, cleanItems);
//   updated$ = fluxStored<Dictionary<T>>(this.name+'Updated', {}, isDictionary, cleanItems);
//   removed$ = fluxStored<Dictionary<T>>(this.name+'Removed', {}, isDictionary, cleanItems);



//   readonly byId$ = fluxDictionary<T>(this.data$.throttle(100));
//   items$ = this.byId$.map(dico => Object.values(dico));
//   byKey$ = fluxDictionary<T>(this.byId$.map(dico => byId(dico, i => (i as any).key)));

//   constructor(client: ApiClient, name: string) {
//     super(client, name);

//     this.data$.onListeners = this.onListeners;
//     this.client.groupId$.on(() => this.sync());
//     this.sync();
//   }

//   onListeners(thens: Listener<Dictionary<T>>[], catches: Listener<Error>[]) {
//     this.log.d('onListeners', thens, catches);
//     if (thens.length > 0) {
//       this.start();
//     } else {
//       this.stop();
//     }
//   }

//   _pool?: any;

//   start() {
//     if (this._pool) return;
//     this.log.d('start');
//     this._pool = setInterval(() => this.sync(), 10 * SECOND);
//     this.sync();
//   }

//   stop() {
//     if (!this._pool) return;
//     this.log.d('stop');
//     clearInterval(this._pool);
//   }

//   async sync() {
//     if (document.hidden) return;

//     this.log.d('sync');

//     const remoteById = byId(await this.list({}, ['id', 'updated', 'removed']));
//     const localById = this.data$.get();

//     const ids = Object.keys({ ...remoteById, ...localById });
//     const bulk: any[] = [];

//     for (const id of ids) {
//       const local = localById[id];
//       const remote = remoteById[id];

//       if (local) {


//         if (!remote) {
//           bulk.push(['new', local]);
//         }
//       }




//       changes[id] = [local, remote];




//       if (!local) continue;

//       if (!remote) {
//         if (local.created) {
//           changes[local.id] = null;
//           continue;
//         } else {
//           const created = await this.create(local);
//           changes[local.id] = null;
//           changes[created.id] = created;
//         }
//       }
//     }

//     for (const id in remoteById) {
//       const remote = remoteById[id];
//       if (!remote) continue;

//       const local = localById[id];
//       if (!local) {
//         changes[local.id] = null;
//       }
//       else {

//       }
//     }







//     // let changes: Dictionary<T | null> = next;
//     // if (!reset) {
//     //   changes = { ...changes };
//     //   for (const id in prev) {
//     //     const p = prev[id];
//     //     if (p && !next[id]) {
//     //       changes[id] = null;
//     //     }
//     //   }
//     // }
//     // this.data$.update(changes as Dictionary<T>);
//     // this.log.d('loaded', { reset, prev, next, changes });
//   }

//   getById(itemOrId: ItemOrId<T>) {
//     const id = toId(itemOrId);
//     if (!id) return undefined;
//     const byId = this.byId$.get();
//     return byId[id];
//   }

//   getByKey(key: string) {
//     const byKey = this.byKey$.get();
//     return byKey[key];
//   }

//   find(predicate: (value: T, index: number, obj: T[]) => value is T) {
//     const items = this.items$.get();
//     const item = items.find(predicate);
//     this.log.d('find', predicate, items, item);
//     return item;
//   }

//   filter(predicate: (value: T, index: number, array: T[]) => value is T) {
//     const items = this.items$.get();
//     const filteredItems = items.filter(predicate);
//     this.log.d('filter', predicate, items, filteredItems);
//     return filteredItems;
//   }

//   find$(predicate: (value: T, index: number, obj: T[]) => value is T) {
//     return this.byId$.map(() => this.find(predicate));
//   }

//   filter$(predicate: (value: T, index: number, array: T[]) => value is T) {
//     return this.byId$.map(() => this.filter(predicate));
//   }

//   private set(itemOrId: ItemOrId<T>, item: T | undefined | null): T | undefined {
//     const id = toId(itemOrId);
//     if (!id) return undefined;
//     this.data$.setItem(id, item);
//     return item || undefined;
//   }

//   async apply(itemOrId: ItemOrId<T>, cb: (next: T) => void, options?: ReqOptions<T>): Promise<T | undefined> {
//     const id = toId(itemOrId);
//     if (!id) return undefined;
//     this.log.d('apply', id, options);

//     const prev = this.getById(id);
//     if (!prev) return undefined;
    
//     const next = deepClone(prev) as T;
//     cb(next);
    
//     const changes = getChanges(prev, next);
//     if (isEmpty(changes)) return prev;

//     this.set(id, next);
//     try {
//       const result = await this.update(id, changes, options);
//       return this.set(id, { ...next, ...result })!;
//     } catch (e) {
//       this.set(id, prev);
//       throw e;
//     }
//   }

//   async create(data: ModelCreate<T>, options?: ReqOptions<T>): Promise<T> {
//     const now = serverDate().toISOString();
//     const userId = this.client.needUserId();
//     const groupId = this.client.needGroupId();
//     const next = { id: uuid(), updated: now, userId, groupId, ...data };
//     this.set(next.id, next);
//     try {
//       const item = await super.create(data, options);
//       this.set(item.id, item);
//       return item;
//   }

//   async update(itemOrId: ItemOrId<T>, changes: ModelUpdate<T>, options?: ReqOptions<T>): Promise<T|undefined> {
//     const prev = this.getById(itemOrId);
//     if (prev) this.set(itemOrId, { ...prev, ...changes });
//     try {
//       const item = await super.update(itemOrId, changes, options);
//       this.set(itemOrId, item);
//       return item;
//     }
//     catch (error) {
//       this.set(itemOrId, prev);
//       throw error;
//     }
//   }

//   async remove(itemOrId: ItemOrId<T>, options?: ReqOptions<T>): Promise<T|undefined> {
//     const prev = this.getById(itemOrId);
//     this.set(itemOrId, null);
//     try {
//       const item = await super.remove(itemOrId, options);
//       return item;
//     }
//     catch (error) {
//       this.set(itemOrId, prev);
//       throw error;
//     }
//   }
// }