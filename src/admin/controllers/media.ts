import { MediaModel, PlaylistModel } from '@common/api';
import { mediaSync } from '@/api/sync';
import { deepClone, getChanges, groupBy, isEmpty, isItem, isList, sort, uniq } from '@common/utils';
import { uuid } from '../../../common/utils/str';
import { needGroupId } from '../../../common/api/messages';
import { JobModel } from '../../../common/api/models';
import { toError } from '../../../common/utils/cast';
import { MsgDict } from '@common/utils';
import { needAuthId } from '../../../common/api/apiReq';

const MAX_CONCURRENT_UPLOADS = 3;

export interface UploadItem extends JobModel {
  file: File;
  parent?: string;
}

export const uploadMediaJobs$ = new MsgDict<UploadItem>({});

const update = (id: string, changes: Partial<UploadItem>) => {
  changes.updated = new Date();
  uploadMediaJobs$.merge({ [id]: changes });
};

const startUploadMedia = async (item: UploadItem) => {
  const id = item.id;
  console.info('upload started', { id, item });

  try {
    const file = item.file;
    if (!file) return;

    update(id, { status: 'processing' });

    const parent = item.parent && (await mediaSync.get(item.parent));

    console.debug('upload creating', { item });
    const media = await mediaSync.create(
      {
        title: String(file.name),
        source: file,
        group: needGroupId(),
        user: needAuthId(),
        parent: parent?.id,
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

    if (parent && parent.type === 'playlist') {
      console.debug('upload apply playlist', { item, media, parent });
      await mediaSync.apply(parent.id, (next) => {
        next.deps.push(media.id);
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
    const items = Object.values(uploadMediaJobs$.v);
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

export const uploadMedia = (files: File[], parent?: string): string[] => {
  console.debug('uploadMedia', { files, parent });
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
        parent,
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
  next.deps = uniq(next.deps);
  const changes = getChanges(prev, next);
  if (!isEmpty(changes)) {
    return await mediaSync.update(id, changes);
  }
};

const cleanPlaylist = (next: PlaylistModel) => {
  if (!isItem(next.data)) next.data = {};
  const data = next.data;

  if (!isList(data.items)) data.items = [];
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
