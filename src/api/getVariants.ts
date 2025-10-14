import { FileInfo, MediaModel } from '@common/api';
import { isStrDef } from '@common/utils';

export interface Variant extends FileInfo {
  media: MediaModel;
  file: string;
}

export const getVariants = (media?: MediaModel): Variant[] => {
  if (!media || !media.data) return [];
  const results: Variant[] = [];
  media.data?.variants?.forEach((info, i) => {
    if (!media.variants) return;
    const file = media.variants[i];
    if (isStrDef(file) && info.mime) {
      results.push({ ...info, file, media, mime: info.mime });
    }
  });
  if (isStrDef(media.source) && media.mime && media.type && media.bytes !== undefined) {
    const file = media.source;
    results.push({ ...media, file, media, mime: media.mime, type: media.type, bytes: media.bytes });
  }
  return results;
};
