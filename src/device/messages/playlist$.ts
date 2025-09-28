import { isItems, isItem } from '@common/utils';
import { newMsg } from '@common/utils/Msg';

export interface Playlist {
  items: any[];
}

export const isPlaylist = (playlist: Playlist) => isItem(playlist) && isItems(playlist.items);

export const playlist$ = newMsg<Playlist>({ items: [] }, 'playlist', true, isPlaylist);
