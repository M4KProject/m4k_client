import { Msg } from '@common/helpers';

export const search$ = new Msg('', 'search$', true);
export const searchDebounced$ = search$.debounce(400);
