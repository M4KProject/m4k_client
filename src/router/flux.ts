import { fluxStored, isItem } from 'fluxio';
import { Route } from './types';

export const routeNotDebounced$ = fluxStored<Route>('route$', {}, isItem);
export const route$ = routeNotDebounced$.debounce(50);

export const page$ = route$.map((r) => r.page || '');
export const isEdit$ = route$.map((r) => r.isEdit || false);
export const isAdmin$ = route$.map((r) => r.isAdmin || false);
export const isAdvanced$ = route$.map((r) => r.isAdvanced || false);
export const mediaType$ = route$.map((r) => r.mediaType || '');
export const mediaKey$ = route$.map((r) => r.mediaKey || '');
export const groupKey$ = route$.map((r) => r.groupKey || '');
export const deviceKey$ = route$.map((r) => r.deviceKey || '');
