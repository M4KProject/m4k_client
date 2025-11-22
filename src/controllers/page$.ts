import { flux } from 'fluxio';
import { getUrlParams } from 'fluxio';

export type PageName =
  | 'codePin'
  | 'kiosk'
  | 'actions'
  | 'playlist'
  | 'configPlaylist'
  | 'wifi'
  | 'test'
  | 'logs'
  | 'events'
  | 'pairing'
  | '';

export const page$ = flux<PageName>((getUrlParams(location.href).page as PageName) || 'kiosk');
