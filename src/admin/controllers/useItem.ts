import { Sync, groupId$ } from '@common/api';
import { CollWhere } from '@common/api/Coll';
import { Models } from '@common/api/models';
import { useMsg } from '@common/hooks';

export const useItemKey = <K extends keyof Models>(
    sync: Sync<K, Models[K]>,
    key?: string,
) => useMsg(sync.find$([key, { key } as any]));

export const useItem = <K extends keyof Models>(
    sync: Sync<K, Models[K]>,
    where?: string | CollWhere<Models[K]>,
) => useMsg(sync.find$(where));

export const useItems = <K extends keyof Models>(
    sync: Sync<K, Models[K]>,
    where?: CollWhere<Models[K]>,
) => useMsg(sync.filter$(where));

export const useGroupItems = <K extends keyof Models>(sync: Sync<K, Models[K]>, where?: CollWhere<Models[K]>) => {
    const group = useMsg(groupId$);
    return useMsg(sync.filter$(group ? { ...where, group } : where))
};





// export const useItems = <K extends keyof Models>(
//   sync: Sync<K, Models[K]>,
//   where?: CollWhere<Models[K]>
// ) => {
//   const [state, setState] = useState(() => sync.find(where));

//   useEffect(() => sync.on(where), [sync]);
//   useEffect(() => {
//     setState(coll.findCache(where));
//     coll.find$(where).on(setState);
//   }, [coll, stringify(where)]);

//   return state;
// };

// export const useSyncItemsInGroup = <K extends keyof Models>(
//   sync: Sync<K, Models[K]>,
//   where?: CollWhere<Models[K]>
// ) => {
//   const group = useMsg(groupId$);
//   return useItems(coll, { ...where, group });
// };

// export const useSyncItem = <K extends keyof Models>(
//   sync: Sync<K, Models[K]>,
//   where?: string | CollWhere<Models[K]>
// ) => {
//   const [state, setState] = useState(() => coll.getCache(where));

//   useEffect(() => coll.on(), [coll]);
//   useEffect(() => {
//     setState(coll.get(where));
//     coll.one$(where).on(setState);
//   }, [coll, stringify(where)]);

//   return state;
// };
