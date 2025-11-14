import { Dictionary } from 'fluxio';
import { Variant } from './getVariants';
import { ApiCtrl } from './ApiCtrl';

export const getMediaUrl = (
  api: ApiCtrl,
  v?: Variant,
  thumb?: string | number,
  download?: boolean,
  params?: Dictionary<string>
) => (v && api.media.coll.getFileUrl(v.media.id, v.file, thumb, download, params)) || '';
