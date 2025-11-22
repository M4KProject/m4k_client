import { MediaType } from '@/api/models';
import { toBoolean, toString, isDeepEqual, getUrlParams } from 'fluxio';
import { Page, Route } from './types';
import { getRoute } from './getters';
import { routeNotDebounced$ } from './flux';

const cleanRoute = (route: Route): Route => ({
  page: toString(route.page) as Page,
  isEdit: toBoolean(route.isEdit),
  isAdmin: toBoolean(route.isAdmin),
  isAdvanced: toBoolean(route.isAdvanced),
  mediaType: toString(route.mediaType) as MediaType,
  mediaKey: toString(route.mediaKey),
  groupKey: toString(route.groupKey),
  deviceKey: toString(route.deviceKey),
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

const q = { ...getUrlParams() };

const mediaKey = q.media || q.m;
if (mediaKey) q.mediaKey = mediaKey;

const groupKey = q.group || q.g;
if (groupKey) q.groupKey = groupKey;

updateRoute(q as Partial<Route>);
