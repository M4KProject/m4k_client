import { MediaModel } from '@/api/models';

export interface Route {
  page?: Page;
  isEdit?: boolean;
  isAdmin?: boolean;
  isAdvanced?: boolean;
  mediaType?: MediaModel['type'];
  mediaKey?: string;
  groupKey?: string;
  deviceKey?: string;
}
