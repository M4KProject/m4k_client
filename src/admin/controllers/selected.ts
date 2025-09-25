import { Dict, MsgDict } from '@common/utils';

export const selectedById$ = new MsgDict<boolean>({});

export const updateSelected = (changes: Dict<boolean>) => selectedById$.update(changes);
