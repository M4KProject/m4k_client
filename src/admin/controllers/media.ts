import { MediaModel, PlaylistModel } from '@common/api';
import { mediaCtrl } from '../../colls';
import { deepClone, getChanges, groupBy, isEmpty, isItem, isList, sort, uniq } from '@common/utils';

export const updateMedia = async <T extends MediaModel>(id: string, apply: (next: T) => void) => {
  const prev = mediaCtrl.get(id);
  if (!prev) return;
  const next = deepClone(prev);
  if (!isItem(next.data)) next.data = {};
  apply(next as T);
  next.deps = uniq(next.deps);
  const changes = getChanges(prev, next);
  if (!isEmpty(changes)) {
    return await mediaCtrl.update(id, changes);
  }
};

const cleanPlaylist = (next: PlaylistModel) => {
  if (!isItem(next.data)) next.data = {};
  const data = next.data;

  if (!isList(data.items)) data.items = [];
  data.items = data.items.filter(isItem);
  const items = data.items;

  const mediaById = mediaCtrl.byId();
  const itemsByMediaId = groupBy(items, (item) => item.media || '');
  delete itemsByMediaId[''];

  Object.entries(itemsByMediaId).map(([mediaId, mediaItems]) => {
    const media = mediaById[mediaId];
    if (!media) {
      mediaItems.forEach((item) => (item.media = ''));
      delete itemsByMediaId[mediaId];
    }
  });

  next.deps = sort(Object.keys(itemsByMediaId));
};

export const updatePlaylist = async (id: string, apply: (next: PlaylistModel) => void) =>
  updateMedia<PlaylistModel>(id, (next) => {
    if (next.type !== 'playlist') {
      console.warn('no playlist', id);
      return;
    }

    cleanPlaylist(next);

    apply(next);

    cleanPlaylist(next);
  });
