import { Msg } from '@common/utils';

export const search$ = new Msg('', 'search$', true);
export const searchDebounced$ = search$.debounce(400);
