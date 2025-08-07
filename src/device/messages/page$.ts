import { m4k } from "@common/m4k";
import {Msg} from "@common/helpers/Msg";
import { readUrlParams } from "@common/helpers/urlParams";
import {useMsg} from "@common/hooks/useMsg";

export const page$ = new Msg(readUrlParams().page || 'kiosk')

export const usePage = () => useMsg(page$)

export const setPage = (value: string) => page$.set(value)

page$.on((page, oldPage) => {
    if (oldPage !== page && page === 'kiosk') {
        m4k.restart()
    }
})