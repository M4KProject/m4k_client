import { isArray, isObject } from "@common/helpers";
import { newMsg } from "@common/helpers/Msg";

export interface Playlist {
    items: any[];
}

export const isPlaylist = (playlist: Playlist) => (
    isObject(playlist) &&
    isArray(playlist.items)
)

export const playlist$ = newMsg<Playlist>({ items: [] }, 'playlist', true, isPlaylist);