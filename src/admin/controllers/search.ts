import { Flux } from 'fluxio';

export const search$ = new Flux('', 'search$', true);
export const searchDebounced$ = search$.debounce(400);
