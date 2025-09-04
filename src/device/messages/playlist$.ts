import { isArrayOfRecords, isRecord } from "@common/helpers";
import { newMsg } from "@common/helpers/Msg";

export interface Playlist {
    items: any[];
}

export const isPlaylist = (playlist: Playlist) => (
    isRecord(playlist) &&
    isArrayOfRecords(playlist.items)
)

export const playlist$ = newMsg<Playlist>({ items: [] }, 'playlist', true, isPlaylist);