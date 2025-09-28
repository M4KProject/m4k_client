import { MediaType } from '@common/api';
import { getUrlQuery } from '@common/ui';
import { toBool, toStr } from '@common/utils';
import { Page, Route } from './types';
import { getRoute } from './getters';
import { routeNotDebounced$ } from './msgs';
import { isDeepEqual } from '@common/utils/isDeepEqual';

const cleanRoute = (route: Route): Route => ({
  page: toStr(route.page) as Page,
  isEdit: toBool(route.isEdit),
  isAdmin: toBool(route.isAdmin),
  isAdvanced: toBool(route.isAdvanced),
  mediaType: toStr(route.mediaType) as MediaType,
  mediaKey: toStr(route.mediaKey),
  groupKey: toStr(route.groupKey),
  deviceKey: toStr(route.deviceKey),
});

const setRoute = (route: Route) => {
  const prev = getRoute();
  const next = cleanRoute(route);
  if (!isDeepEqual(prev, next)) routeNotDebounced$.set(next);
};

export const updateRoute = (changes: Partial<Route>) => setRoute({ ...getRoute(), ...changes });

const propSetter =
  <K extends keyof Route>(prop: K) =>
  (value: Route[K]) =>
    updateRoute({ [prop]: value });

export const setPage = propSetter('page');
export const setIsEdit = propSetter('isEdit');
export const setIsAdmin = propSetter('isAdmin');
export const setIsAdvanced = propSetter('isAdvanced');
export const setMediaType = propSetter('mediaType');
export const setMediaKey = propSetter('mediaKey');
export const setGroupKey = propSetter('groupKey');
export const setDeviceKey = propSetter('deviceKey');

const q = { ...getUrlQuery() };
if (q.media || q.m) q.mediaKey = q.media || q.m;
if (q.group || q.g) q.groupKey = q.group || q.g;
updateRoute(q as Partial<Route>);
