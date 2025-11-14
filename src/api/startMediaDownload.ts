import { getExt, isString, removeAccents } from 'fluxio';
import { MediaModel } from './models';
import { getMediaDownloadUrl } from './getMediaDownloadUrl';
import { startDownload } from '@/utils/startDownload';
import { ApiCtrl } from './ApiCtrl';

export const startMediaDownload = (api: ApiCtrl, mediaOrId?: string | MediaModel) => {
  const media = isString(mediaOrId) ? api.media.get(mediaOrId) : mediaOrId;
  if (!media) return;
  const url = getMediaDownloadUrl(api, media);
  const ext = getExt(url);
  const filename =
    removeAccents(media.title || String(media.source) || media.id).trim() + '.' + ext;
  startDownload(url, filename);
};
