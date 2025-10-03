import { getUrl, Thumb } from '@common/api';
import { Variant } from './getVariants';

export const getMediaUrl = (v?: Variant, thumb?: Thumb) =>
  (v && getUrl('medias', v.media.id, v.file, thumb)) || '';
