import { Route } from './types';
import { route$ } from './msgs';

export const getRoute = () => route$.v;

const getter =
  <K extends keyof Route>(prop: K) =>
  (): Route[K] =>
    getRoute()[prop];

export const getPage = getter('page');
export const getIsEdit = getter('isEdit');
export const getIsAdmin = getter('isAdmin');
export const getIsAdvanced = getter('isAdvanced');
export const getMediaType = getter('mediaType');
export const getMediaKey = getter('mediaKey');
export const getGroupKey = getter('groupKey');
export const getDeviceKey = getter('deviceKey');
