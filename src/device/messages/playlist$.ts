import { isListOfItem, isItem } from '@common/utils';
import { newMsg } from '@common/utils/Msg';

export interface Playlist {
  items: any[];
}

export const isPlaylist = (playlist: Playlist) => isItem(playlist) && isListOfItem(playlist.items);

export const playlist$ = newMsg<Playlist>({ items: [] }, 'playlist', true, isPlaylist);
