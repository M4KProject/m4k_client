import { isBool, Msg } from '@common/utils';

export const isDevice$ = new Msg(false, 'isDevice$', true, isBool);
