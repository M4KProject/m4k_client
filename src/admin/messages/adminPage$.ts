import { useMsg } from '@common/hooks';
import { Msg } from '@common/utils';

export type AdminPage =
  | ''
  | 'account'
  | 'groups'
  | 'members'
  | 'devices'
  | 'device'
  | 'contents'
  | 'medias'
  | 'jobs'
  | 'content';

export const adminPage$ = new Msg<AdminPage>('', 'adminPage$', true);

export const useAdminPage = () => useMsg(adminPage$);
