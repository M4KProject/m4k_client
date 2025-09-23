import { MediaModel, PlaylistModel } from '@common/api';
import { mediaCtrl } from '../../colls';
import { deepClone, getChanges, isEmpty, isItem, isList, uniq } from '@common/utils';

export const updateMedia = async <T extends MediaModel>(id: string, apply: (next: T) => void) => {
  const prev = mediaCtrl.getCache(id);
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

export const updatePlaylist = async (id: string, apply: (next: PlaylistModel) => void) =>
  updateMedia<PlaylistModel>(id, (next) => {
    if (next.type !== 'playlist') {
      console.warn('no playlist', id);
      return;
    }

    const data = next.data;

    if (!isList(data.items)) data.items = [];
    data.items = data.items.filter(isItem);

    apply(next as PlaylistModel);

    next.deps = uniq(next.data.items.map((i) => i.media));
  });