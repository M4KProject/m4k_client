// import { ApiClient } from "./ApiClient";
// import { ApiRest } from "./ApiRest";
// import { Filter, FilterItem, FilterProp, ModelBase } from "./models";
// import { byId, Dictionary, Flux, fluxDictionary, fluxStored, isArray, isDictionary, isDictionaryOfItem, isEmpty, isItem, isString, keepIf, Listener, Logger, notImplemented, SECOND } from 'fluxio';

import { isItem, isString } from "fluxio";
import { MId } from "./models";

// const opToFun: Dictionary<(v: any, a: any, b: any) => boolean> = {
//   null: v => v === null,
//   '!null': v => v !== null,
//   '=': (v, a) => v === a,
//   '>': (v, a) => v > a,
//   '<': (v, a) => v < a,
//   '>=': (v, a) => v >= a,
//   '<=': (v, a) => v <= a,
//   '!=': (v, a) => v !== a,
//   in: (v, a) => isArray(a) && a.includes(v),
//   '!in': (v, a) => isArray(a) && !a.includes(v),
//   between: (v, a, b) => v >= a && v <= b,
//   '!between': (v, a, b) => v < a && v > b,
// };

// filter(filter?: Filter<T>, one?: boolean): T[] {
//   const items = this.items$.get();
//   if (isEmpty(filter)) return items;

//   const conditions = Object.entries(filter || {}).map((kv) => {
//     const p = kv[0];
//     const item: FilterProp = kv[1];

//     if (isArray(item)) {
//       const op = item[0];
//       const a = item[1];
//       const b = item[2];
//       const fun = opToFun[op];
//       if (!fun) throw notImplemented(op);
//       return (v: any) => fun(v[p], a, b);
//     } else {
//       return (v: any) => v[p] === filter;
//     }
//   });

//   const predicate = (item: T) => conditions.every((condition) => condition(item));

//   let results = one ? [items.find(predicate)] : items.filter(predicate);
//   results = results.filter((item): item is T => item !== undefined);

//   this.log.d('filter results', { filter, one, items, results });

//   return results as T[];
// }

export const toId = (mId: MId) => isItem(mId) ? mId.id : isString(mId) ? mId : '';
