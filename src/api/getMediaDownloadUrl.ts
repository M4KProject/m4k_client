import { MediaModel } from '@common/api';
import { getVariants } from './getVariants';
import { mediaSync } from './sync';
import { isStr } from '@common/utils';
import { getMediaUrl } from './getMediaUrl';
import { updateUrlParams } from '@common/ui';

export const getMediaDownloadUrl = (mediaOrId?: string | MediaModel) => {
  let url = '';
  const media = isStr(mediaOrId) ? mediaSync.get(mediaOrId) : mediaOrId;
  if (media) {
    const variants = getVariants(media);
    const videos = variants.filter((v) => v.type === 'video');
    if (videos.length) url = getMediaUrl(videos[0]);
    else {
      const images = variants.filter((v) => v.type === 'image');
      if (images.length) url = getMediaUrl(images[0]);
    }
    if (url) url = updateUrlParams(url, { download: '1' });
  }
  return url;
};
