import { clean, getExt, isStr } from '@common/utils';
import { MediaModel } from '@common/api';
import { mediaSync } from './sync';
import { getMediaDownloadUrl } from './getMediaDownloadUrl';
import { startDownload } from '@common/ui';

export const startMediaDownload = (mediaOrId?: string | MediaModel) => {
  const media = isStr(mediaOrId) ? mediaSync.get(mediaOrId) : mediaOrId;
  if (!media) return;
  const url = getMediaDownloadUrl(media);
  const ext = getExt(url);
  const filename = clean(media.title || String(media.source) || media.id) + '.' + ext;
  startDownload(url, filename);
};
