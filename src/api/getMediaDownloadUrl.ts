import { MediaModel } from './models';
import { getVariants } from './getVariants';
import { isString } from 'fluxio';
import { getMediaUrl } from './getMediaUrl';
import { setUrlParams } from 'fluxio';
import { ApiCtrl } from './ApiCtrl';

export const getMediaDownloadUrl = (api: ApiCtrl, mediaOrId?: string | MediaModel) => {
  let url = '';
  const media = isString(mediaOrId) ? api.media.get(mediaOrId) : mediaOrId;
  if (media) {
    const variants = getVariants(media);
    const videos = variants.filter((v) => v.type === 'video');
    if (videos.length) url = getMediaUrl(videos[0]);
    else {
      const images = variants.filter((v) => v.type === 'image');
      if (images.length) url = getMediaUrl(images[0]);
    }
    if (url) url = setUrlParams(url, { download: '1' });
  }
  return url;
};
