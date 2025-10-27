import { MediaModel } from '../api/models';

export type Page = '' | 'account' | 'groups' | 'members' | 'devices' | 'medias' | 'jobs';

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
