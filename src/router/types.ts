export type Page = '' | 'account' | 'groups' | 'members' | 'devices' | 'medias' | 'jobs';

export interface Route {
  page?: Page;
  isEdit?: boolean;
  isAdmin?: boolean;
  isAdvanced?: boolean;
  mediaType?: '' | 'folder' | 'playlist' | 'pdf' | 'image' | 'video' | 'unknown';
  mediaKey?: string;
  groupKey?: string;
  deviceKey?: string;
}
