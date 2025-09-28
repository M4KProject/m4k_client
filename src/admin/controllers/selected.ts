import { Dict, MsgMap } from '@common/utils';

export const selectedById$ = new MsgMap<boolean>({});

export const updateSelected = (changes: TMap<boolean>) => selectedById$.update(changes);
