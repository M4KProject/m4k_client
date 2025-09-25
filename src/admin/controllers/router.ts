import { MediaType } from '@common/api';
import { useMsg } from '@common/hooks';
import { getUrlQuery } from '@common/ui';
import { isEq, Msg, toBool, toStr } from '@common/utils';

export type Page = '' | 'account' | 'groups' | 'members' | 'devices' | 'medias' | 'jobs';

export interface Route {
  page?: Page;
  edit?: boolean;
  isAdmin?: boolean;
  isAdvanced?: boolean;
  mediaType?: '' | 'folder' | 'playlist' | 'pdf' | 'image' | 'video' | 'unknown';
  mediaKey?: string;
  groupKey?: string;
  deviceKey?: string;
}

const route$ = new Msg<Route>({}, 'route$', true);

const cleanRoute = (route: Route): Route => ({
  page: toStr(route.page) as Page,
  edit: toBool(route.edit),
  isAdmin: toBool(route.isAdmin),
  isAdvanced: toBool(route.isAdvanced),
  mediaType: toStr(route.mediaType) as MediaType,
  mediaKey: toStr(route.mediaKey),
  groupKey: toStr(route.groupKey),
  deviceKey: toStr(route.deviceKey),
});

const routeDebounced$ = route$.debounce(50);

export const page$ = routeDebounced$.map((r) => r.page);
export const edit$ = routeDebounced$.map((r) => r.edit);
export const isAdmin$ = routeDebounced$.map((r) => r.isAdmin);
export const isAdvanced$ = routeDebounced$.map((r) => r.isAdvanced);
export const mediaType$ = routeDebounced$.map((r) => r.mediaType);
export const mediaKey$ = routeDebounced$.map((r) => r.mediaKey);
export const groupKey$ = routeDebounced$.map((r) => r.groupKey);
export const deviceKey$ = routeDebounced$.map((r) => r.deviceKey);

export const useRoute = () => useMsg(routeDebounced$);

export const usePage = () => useMsg(page$);
export const useEdit = () => useMsg(edit$);
export const useIsAdmin = () => useMsg(isAdmin$);
export const useIsAdvanced = () => useMsg(isAdvanced$);
export const useMediaType = () => useMsg(mediaType$);
export const useMediaKey = () => useMsg(mediaKey$);
export const useGroupKey = () => useMsg(groupKey$);
export const useDeviceKey = () => useMsg(deviceKey$);

export const getRoute = () => route$.v;
export const setRoute = (route: Route) => {
  const prev = getRoute();
  const next = cleanRoute(route);
  if (!isEq(prev, next)) route$.set(next);
};
export const updateRoute = (changes: Partial<Route>) => setRoute({ ...getRoute(), ...changes });

const propGetter =
  <K extends keyof Route>(prop: K) =>
  (): Route[K] =>
    getRoute()[prop];

export const getPage = propGetter('page');
export const getEdit = propGetter('edit');
export const getIsAdmin = propGetter('isAdmin');
export const getIsAdvanced = propGetter('isAdvanced');
export const getMediaType = propGetter('mediaType');
export const getMediaKey = propGetter('mediaKey');
export const getGroupKey = propGetter('groupKey');
export const getDeviceKey = propGetter('deviceKey');

const propSetter =
  <K extends keyof Route>(prop: K) =>
  (value: Route[K]) =>
    updateRoute({ [prop]: value });

export const setPage = propSetter('page');
export const setEdit = propSetter('edit');
export const setIsAdmin = propSetter('isAdmin');
export const setIsAdvanced = propSetter('isAdvanced');
export const setMediaType = propSetter('mediaType');
export const setMediaKey = propSetter('mediaKey');
export const setGroupKey = propSetter('groupKey');
export const setDeviceKey = propSetter('deviceKey');

const q = getUrlQuery();
updateRoute({
  ...q,
  mediaKey: q.mediaKey || q.media,
  groupKey: q.groupKey || q.group,
  deviceKey: q.deviceKey || q.device,
});
