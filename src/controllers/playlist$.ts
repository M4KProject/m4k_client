import { isItems, isItem } from 'fluxio';
import { fluxStored } from 'fluxio';

export interface Playlist {
  items: any[];
}

export const isPlaylist = (playlist: Playlist) => isItem(playlist) && isItems(playlist.items);

export const playlist$ = fluxStored<Playlist>('playlist$', { items: [] }, isPlaylist);
