import { Msg } from '@common/utils/Msg';
import { getUrlParams } from '@common/ui/urlParams';

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

export const page$ = new Msg<PageName>((getUrlParams(location.href).page as PageName) || 'kiosk');
