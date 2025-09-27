import { groupId$ } from '@common/api/messages';
import { Where } from '@common/api/Coll';
import { GroupModelBase, ModelBase } from '@common/api/models';
import { useMsg } from '@common/hooks';
import { deviceSync, groupSync, jobSync, mediaSync, memberSync, Sync } from '@/api/sync';
import { useDeviceKey, useGroupKey, useMediaKey } from '@/router/hooks';

const useItemKey = <T extends ModelBase>(sync: Sync<T>, key?: string) =>
  useMsg(key ? sync.find$([key, { key } as any]) : null);

const useItem = <T extends ModelBase>(sync: Sync<T>, whereOrId?: string | Where<T>) =>
  useMsg(sync.find$(whereOrId));

const useItems = <T extends ModelBase>(sync: Sync<T>, whereOrId?: Where<T>) =>
  useMsg(sync.filter$(whereOrId));

const useGroupItems = <T extends GroupModelBase>(sync: Sync<T>, where?: Where<T>) => {
  const group = useMsg(groupId$);
  return useMsg(sync.filter$(group ? { ...where, group } : where));
};

export const useDevice = () => useItemKey(deviceSync, useDeviceKey());
export const useMedia = () => useItemKey(mediaSync, useMediaKey());
export const useGroup = () => useItemKey(groupSync, useGroupKey());

export const useGroups = () => useItems(groupSync);
export const useMembers = () => useGroupItems(memberSync);
export const useDevices = () => useGroupItems(deviceSync);
export const useMedias = () => useGroupItems(mediaSync);
export const useJobs = () => useGroupItems(jobSync);
