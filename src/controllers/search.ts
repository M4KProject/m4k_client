import { fluxStored } from 'fluxio';

export const search$ = fluxStored('search$', '');
export const searchDebounced$ = search$.debounce(400);
