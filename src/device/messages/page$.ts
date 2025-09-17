import { Msg } from '@common/utils/Msg';
import { readUrlParams } from '@common/ui/urlParams';

export type PageName =
  | 'codePin'
  | 'kiosk'
  | 'actions'
  | 'site'
  | 'playlist'
  | 'configPlaylist'
  | 'wifi'
  | 'test'
  | 'logs'
  | 'events'
  | 'pairing'
  | '';

export const page$ = new Msg<PageName>((readUrlParams().page as PageName) || 'kiosk');
