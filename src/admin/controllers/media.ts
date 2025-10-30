import {
  BaseMediaModel,
  JobModel,
  MediaModel,
  needAuthId,
  needGroupId,
  PageModel,
  PlaylistModel,
} from '@/api';
import { mediaSync } from '@/api/sync';
import {
  deepClone,
  getChanges,
  groupBy,
  isEmpty,
  isItem,
  isArray,
  sortItems,
  uniq,
  fluxDictionary,
  toError,
  uuid,
  randString,
} from 'fluxio';

const MAX_CONCURRENT_UPLOADS = 3;

export interface UploadItem extends JobModel {
  file: File;
  folder?: MediaModel;
  playlist?: MediaModel;
}

export const uploadMediaJobs$ = fluxDictionary<UploadItem>();

const update = (id: string, changes: Partial<UploadItem>) => {
  changes.updated = new Date();
  uploadMediaJobs$.merge({ [id]: changes });
};

const startUploadMedia = async (item: UploadItem) => {
  const { id, folder, playlist } = item;
  console.info('upload started', { id, item });

  try {
    const file = item.file;
    if (!file) return;

    update(id, { status: 'processing' });

    console.debug('upload creating', { item });
    const media = await mediaSync.create(
      {
        title: String(file.name),
        source: file,
        group: needGroupId(),
        user: needAuthId(),
        parent: folder?.id,
      },
      {
        req: {
          xhr: true,
          timeout: 5 * 60 * 1000,
          onProgress: (progress) => {
            console.debug('upload progress', id, progress);
            update(id, { progress: progress * 100 });
          },
        },
      }
    );

    console.debug('upload created', { item, media });

    if (playlist) {
      console.debug('upload apply playlist', { item, media, playlist });
      await mediaSync.apply(playlist.id, (next) => {
        if (!next.deps) next.deps = [];
        next.deps.push(media.id);
        if (!next.data) next.data = {};
        if (!next.data.items) next.data.items = [];
        next.data.items.push({ media: media.id });
      });
    }

    update(id, { progress: 100, status: 'finished' });

    console.info('upload success', item, media);
    return media;
  } catch (e) {
    const error = toError(e);
    console.warn('upload failed', item, error);
    update(id, { error: error.message, status: 'failed' });
  } finally {
    setTimeout(() => {
      console.debug('upload clean', id, item);
      uploadMediaJobs$.delete(id);
    }, 5000);
  }
};

const processQueue = async () => {
  while (true) {
    const items = Object.values(uploadMediaJobs$.get());
    if (items.filter((i) => i.status === 'processing').length >= MAX_CONCURRENT_UPLOADS) {
      return;
    }

    const item = items.find((i) => i.status === '');
    if (!item) {
      return;
    }

    await startUploadMedia(item);
  }
};

export const uploadMedia = (
  files: File[],
  folder?: MediaModel,
  playlist?: MediaModel
): string[] => {
  console.debug('uploadMedia', { files, folder });
  const ids = files.map((file) => {
    const id = uuid();
    uploadMediaJobs$.update({
      [id]: {
        id,
        file,
        name: file.name,
        action: 'upload',
        status: '',
        created: new Date(),
        updated: new Date(),
        folder,
        playlist,
      },
    });
    return id;
  });
  processQueue();
  return ids;
};

export const updateMedia = async <T extends MediaModel>(id: string, apply: (next: T) => void) => {
  const prev = mediaSync.get(id);
  if (!prev) return;
  const next = deepClone(prev);
  if (!isItem(next.data)) next.data = {};
  apply(next as T);
  next.deps = uniq(next.deps || []);
  const changes = getChanges(prev, next);
  if (!isEmpty(changes)) {
    return await mediaSync.update(id, changes);
  }
};

const cleanPlaylist = (next: PlaylistModel) => {
  if (!isItem(next.data)) next.data = {};
  const data = next.data;

  if (!isArray(data.items)) data.items = [];
  data.items = data.items.filter(isItem);
  const items = data.items;

  const mediaById = mediaSync.byId();
  const itemsByMediaId = groupBy(items, (item) => item.media || '');
  delete itemsByMediaId[''];

  Object.entries(itemsByMediaId).map(([mediaId, mediaItems]) => {
    const media = mediaById[mediaId];
    if (!media) {
      mediaItems.forEach((item) => (item.media = ''));
      delete itemsByMediaId[mediaId];
    }
  });

  const sortedDeps = sortItems(Object.keys(itemsByMediaId));
  next.deps = sortedDeps ? sortedDeps : [];
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

export const getMediaData = <T extends BaseMediaModel>(media: T): T['data'] =>
  isItem(media.data) ? media.data : (media.data = {});

export const updatePage = async (id: string, apply: (next: PageModel) => void) =>
  updateMedia<PageModel>(id, (next) => {
    if (next.type !== 'page') {
      console.warn('not a page', id);
      return;
    }
    apply(next);
  });
