import {
  contentColl,
  ContentModel,
  deviceColl,
  DeviceModel,
  groupColl,
  groupId$,
  GroupModel,
} from '@common/api';
import { isItem, router, toStr } from '@common/helpers';
import { Msg } from '@common/helpers';

export type AdminPage =
  | 'account'
  | 'groups'
  | 'members'
  | 'devices'
  | 'device'
  | 'contents'
  | 'medias'
  | 'content';
export const adminPage$ = new Msg<AdminPage>('groups');

export const device$ = new Msg<DeviceModel | null>(null, 'device', true, isItem);
export const group$ = new Msg<GroupModel | null>(null, 'group', true, isItem);
export const content$ = new Msg<ContentModel | null>(null, 'content');

group$.on((g) => groupId$.set(g?.id || ''));
groupId$.on(async (id) => {
  if (group$.v?.id === id) return;
  if (!id) return group$.set(null);
  group$.set(await groupColl.get(id));
});

// content$.on(content => {
//   if (content) contentKey$.set(content.key||'');
// });

// group$.on(group => {
//   if (group) groupKey$.set(group.key||'');
//   groupId$.set(group?.id||'');
// });

const getGroupKey = () => group$.v?.key || 'all';

export const openDashboard = () => router.push(`/admin/`);
export const openAccount = () => router.push(`/admin/account`);
export const openGroups = () => router.push(`/admin/groups`);

export const openMembers = () => router.push(`/admin/members/${getGroupKey()}`);
export const openDevices = () => router.push(`/admin/devices/${getGroupKey()}`);
export const openContents = () => router.push(`/admin/contents/${getGroupKey()}`);
export const openMedias = () => router.push(`/admin/medias/${getGroupKey()}`);

export const openContent = (contentKey: string) =>
  router.push(`/admin/contents/${getGroupKey()}/${contentKey}`);
export const openDevice = (deviceKey: string) =>
  router.push(`/admin/device/${getGroupKey()}/${deviceKey}`);

// export const openDevice = (deviceKey: string) => router.push(`/devices/${deviceKey}`);
// export const openContent = (contentKey: string) => router.push(`/contents/${contentKey}`);
// export const openMedia = (mediaId: string) => router.push(`/medias/${mediaId}`);

// export const openEditor = (contentKey: string) => router.push(`/admin/editor/${contentKey}`);
// export const openEditorPage = (contentKey: string, contentPage: string) => router.push(`/admin/editor/${contentKey}/${contentPage}`);

// export const openContent = (contentKey: string) => router.push(`/${contentKey}`);
// export const openContentPage = (contentKey: string, contentPage: string) => router.push(`/${contentKey}/${contentPage}`);

export const initAdminRouter = () => {
  const _params = (adminPage: AdminPage) => ({ adminPage });

  router.add('/admin', null, _params('groups'));

  router.add('/admin/account', null, _params('account'));
  router.add('/admin/groups', null, _params('groups'));

  router.add('/admin/members/:groupKey', null, _params('members'));
  router.add('/admin/devices/:groupKey', null, _params('devices'));
  router.add('/admin/device/:groupKey/:deviceKey', null, _params('device'));
  router.add('/admin/contents/:groupKey', null, _params('contents'));
  router.add('/admin/contents/:groupKey/:contentKey', null, _params('content'));
  router.add('/admin/medias/:groupKey', null, _params('medias'));

  // router.add('/devices/:deviceId', null, _params('device'));
  // router.add('/contents/:contentId', null, _params('content'));
  // router.add('/medias/:mediaId', null, _params('media'));

  // router.add('/admin/editor/:contentKey', null, _params('editor'));
  // router.add('/admin/editor/:contentKey/:contentPage', null, _params('editor'));

  router.updated$.on(async () => {
    const { adminPage, groupKey, contentKey, deviceKey } = router.current.params;

    adminPage$.set(toStr(adminPage, '') as AdminPage);

    if (device$.v?.key !== deviceKey) device$.set(await deviceColl.findKey(deviceKey));

    if (content$.v?.key !== contentKey) content$.set(await contentColl.findKey(contentKey));

    if (group$.v?.key !== groupKey) group$.set(await groupColl.findKey(groupKey));
  });

  router.forceRefresh();
};
