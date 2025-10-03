import { FileInfo, MediaModel } from '@common/api';
import { isStrDef } from '@common/utils';

export interface Variant extends FileInfo {
  media: MediaModel;
  file: string;
}

export const getVariants = (media?: MediaModel): Variant[] => {
  if (!media || !media.data) return [];
  const results = [];
  media.data?.variants?.forEach((info, i) => {
    const file = media.variants[i];
    if (isStrDef(file)) {
      results.push({ ...info, file, media });
    }
  });
  if (isStrDef(media.source)) {
    const file = media.source;
    results.push({ ...media, file, media });
  }
  return results;
};
