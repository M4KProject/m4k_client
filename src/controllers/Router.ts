import { contentColl, ContentModel, groupColl, groupId$, GroupModel } from '@common/api';
import { isObject, isString, router, toStr } from '@common/helpers';
import { Msg } from "@common/helpers";

export type AdminPage = 'account' | 'groups' | 'members' | 'devices' | 'device' | 'contents' | 'medias' | 'content';
export const adminPage$ = new Msg<AdminPage>("groups");

export const groupKey$ = new Msg<string>("", "groupKey", true, isString);
export const contentKey$ = new Msg<string>("", "contentKey", true, isString);
export const deviceKey$ = new Msg<string>("", "deviceKey", true, isString);

export const group$ = new Msg<GroupModel|null>(null, "group", true, isObject);
export const content$ = new Msg<ContentModel|null>(null, "content");

contentKey$.on(async (key) => {
  const content = await contentColl.findOne({ key }) || await contentColl.get(key);
  content$.set(content);
});

groupKey$.on(async (key) => {
  if (key === 'all') {
    group$.set(null);
    return;
  }
  const group = await groupColl.findOne({ key }) || await groupColl.get(key);
  group$.set(group);
});

group$.on(group => {
  groupId$.set(group?.id || '');
});



// content$.on(content => {
//   if (content) contentKey$.set(content.key||'');
// });

// group$.on(group => {
//   if (group) groupKey$.set(group.key||'');
//   groupId$.set(group?.id||'');
// });

const getGroupKey = () => groupKey$.v || 'all';

export const openDashboard = () => router.push(`/`);
export const openAccount = () => router.push(`/account`);
export const openGroups = () => router.push(`/groups`);

export const openMembers = () => router.push(`/members/${getGroupKey()}`);
export const openDevices = () => router.push(`/devices/${getGroupKey()}`);
export const openContents = () => router.push(`/contents/${getGroupKey()}`);
export const openMedias = () => router.push(`/medias/${getGroupKey()}`);

export const openContent = (contentKey: string) => router.push(`/contents/${getGroupKey()}/${contentKey}`);
export const openDevice = (deviceKey: string) => router.push(`/device/${getGroupKey()}/${deviceKey}`);

// export const openDevice = (deviceKey: string) => router.push(`/devices/${deviceKey}`);
// export const openContent = (contentKey: string) => router.push(`/contents/${contentKey}`);
// export const openMedia = (mediaId: string) => router.push(`/medias/${mediaId}`);

// export const openEditor = (contentKey: string) => router.push(`/admin/editor/${contentKey}`);
// export const openEditorPage = (contentKey: string, contentPage: string) => router.push(`/admin/editor/${contentKey}/${contentPage}`);

// export const openContent = (contentKey: string) => router.push(`/${contentKey}`);
// export const openContentPage = (contentKey: string, contentPage: string) => router.push(`/${contentKey}/${contentPage}`);

export const initAdminRouter = () => {

  const _params = (adminPage: AdminPage) => ({ adminPage })

  router.add('', null, _params('account'));

  router.add('/account', null, _params('account'));
  router.add('/groups', null, _params('groups'));

  router.add('/members/:groupKey', null, _params('members'));
  router.add('/devices/:groupKey', null, _params('devices'));
  router.add('/device/:groupKey/:deviceKey', null, _params('device'));
  router.add('/contents/:groupKey', null, _params('contents'));
  router.add('/contents/:groupKey/:contentKey', null, _params('content'));
  router.add('/medias/:groupKey', null, _params('medias'));

  // router.add('/devices/:deviceId', null, _params('device'));
  // router.add('/contents/:contentId', null, _params('content'));
  // router.add('/medias/:mediaId', null, _params('media'));
  
  // router.add('/admin/editor/:contentKey', null, _params('editor'));
  // router.add('/admin/editor/:contentKey/:contentPage', null, _params('editor'));

  router.updated$.on(() => {
    const { adminPage, groupKey, contentKey, deviceKey } = router.current.params;
    adminPage$.set(toStr(adminPage, '') as AdminPage);
    groupKey$.set(toStr(groupKey, ''));
    contentKey$.set(toStr(contentKey, ''));
    deviceKey$.set(toStr(deviceKey, ''));
  });

  router.forceRefresh();
}