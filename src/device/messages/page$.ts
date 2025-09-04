import { m4k } from "@common/m4k";
import { Msg } from "@common/helpers/Msg";
import { readUrlParams } from "@common/helpers/urlParams";

export type PageName =
    'codePin'|
    'kiosk'|
    'actions'|
    'site'|
    'playlist'|
    'configPlaylist'|
    'wifi'|
    'test'|
    'logs'|
    'events'|
    'pairing'|
    '';

export const page$ = new Msg<PageName>((readUrlParams().page as PageName) || 'kiosk');

page$.on((page, oldPage) => {
    if (oldPage !== page && page === 'kiosk') {
        m4k.restart()
    }
})