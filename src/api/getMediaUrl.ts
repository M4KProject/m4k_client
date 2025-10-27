import { Dictionary } from 'fluxio';
import { Variant } from './getVariants';
import { mediaSync } from './sync';

export const getMediaUrl = (v?: Variant, thumb?: string | number, download?: boolean, params?: Dictionary<string>) =>
  (v && mediaSync.coll.getFileUrl(v.media.id, v.file, thumb, download, params)) || '';
