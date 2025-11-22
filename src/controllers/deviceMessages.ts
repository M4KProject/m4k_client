import { isBoolean, isNumber, isString, isStringValid } from 'fluxio';
import { fluxStored } from 'fluxio';
export * from './dialog$';
export * from './page$';
export * from './playlist$';
export * from './contentRotation$';

export const codePin$ = fluxStored<string>('codePin$', 'yoyo', isStringValid);

export const copyDir$ = fluxStored<string>('copyDir$', 'playlist', isStringValid);

export const bgColor$ = fluxStored<string>('bgColor$', '#000000', isStringValid);

export const url$ = fluxStored<string>('url$', '', isString);

export const itemDurationMs$ = fluxStored<number>('itemDurationMs$', 5000, isNumber);

export type ItemFit = 'contain' | 'cover' | 'fill';
export const isItemFit = (v: string) => v === 'contain' || v === 'cover' || v === 'fill';
export const itemFit$ = fluxStored<ItemFit>('itemFit$', 'contain', isItemFit);

export type ItemAnim = 'rightToLeft' | 'topToBottom' | 'fade' | 'zoom';
export const isItemAnim = (v: string) =>
  v === 'rightToLeft' || v === 'topToBottom' || v === 'fade' || v === 'zoom';
export const itemAnim$ = fluxStored<ItemAnim>('itemAnim$', 'zoom', isItemAnim);

export const hasVideoMuted$ = fluxStored<boolean>('hasVideoMuted$', true, isBoolean);

export const offlineMode$ = fluxStored<boolean>('offlineMode$', false, isBoolean);
