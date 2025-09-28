import { Dict, MsgDict } from '@common/utils';

export const selectedById$ = new MsgDict<boolean>({});

export const updateSelected = (changes: Dictionary<boolean>) => selectedById$.update(changes);
