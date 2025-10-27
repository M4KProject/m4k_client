import { clean, getExt, isString } from 'fluxio';
import { MediaModel } from './models';
import { mediaSync } from './sync';
import { getMediaDownloadUrl } from './getMediaDownloadUrl';
import { startDownload } from '@common/ui';

export const startMediaDownload = (mediaOrId?: string | MediaModel) => {
  const media = isString(mediaOrId) ? mediaSync.get(mediaOrId) : mediaOrId;
  if (!media) return;
  const url = getMediaDownloadUrl(media);
  const ext = getExt(url);
  const filename = clean(media.title || String(media.source) || media.id) + '.' + ext;
  startDownload(url, filename);
};
