import { isStrNotEmpty } from '@common/utils';
import { newMsg } from '@common/utils/Msg';

export * from './dialog$';
export * from './page$';
export * from './playlist$';
export * from './contentRotation$';

export const codePin$ = newMsg('yoyo', 'codePin', true, isStrNotEmpty);

export const copyDir$ = newMsg('playlist', 'copyDir', true, isStrNotEmpty);

export const itemDurationMs$ = newMsg(5000, 'itemDurationMs', true);

export type ItemFit = 'contain' | 'cover' | 'fill';
export const isItemFit = (v: string) => v === 'contain' || v === 'cover' || v === 'fill';
export const itemFit$ = newMsg<ItemFit>('contain', 'itemFit', true, isItemFit);

export type ItemAnim = 'rightToLeft' | 'topToBottom' | 'fade' | 'zoom';
export const isItemAnim = (v: string) =>
  v === 'rightToLeft' || v === 'topToBottom' || v === 'fade' || v === 'zoom';
export const itemAnim$ = newMsg<ItemAnim>('zoom', 'itemAnim', true, isItemAnim);

export const hasVideoMuted$ = newMsg(true, 'hasVideoMuted', true);

export const url$ = newMsg('', 'url', true);

export const offlineMode$ = newMsg(false, 'offlineMode', true);
