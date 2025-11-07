import { getExt, isString, removeAccents } from 'fluxio';
import { MediaModel } from './models';
import { mediaSync } from './sync';
import { getMediaDownloadUrl } from './getMediaDownloadUrl';
import { startDownload } from '@/utils/startDownload';

export const startMediaDownload = (mediaOrId?: string | MediaModel) => {
  const media = isString(mediaOrId) ? mediaSync.get(mediaOrId) : mediaOrId;
  if (!media) return;
  const url = getMediaDownloadUrl(media);
  const ext = getExt(url);
  const filename =
    removeAccents(media.title || String(media.source) || media.id).trim() + '.' + ext;
  startDownload(url, filename);
};
