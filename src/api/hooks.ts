import { groupId$ } from '@common/api/messages';
import { Where } from '@common/api/Coll';
import { GroupModelBase, MediaModel, ModelBase } from '@common/api/models';
import { useMsg } from '@common/hooks';
import { deviceSync, groupSync, jobSync, mediaSync, memberSync, Sync } from '@/api/sync';
import { useDeviceKey, useGroupKey, useMediaKey, useIsAdvanced } from '@/router/hooks';
import { useMemo } from 'preact/hooks';

const useItemKey = <T extends ModelBase>(sync: Sync<T>, key?: string) =>
  useMsg(key ? sync.find$([key, { key } as any]) : null);

const useItems = <T extends ModelBase>(sync: Sync<T>, whereOrId?: Where<T>) =>
  useMsg(sync.filter$(whereOrId));

const useGroupItems = <T extends GroupModelBase>(sync: Sync<T>, where?: Where<T>) => {
  const group = useMsg(groupId$);
  return useMsg(sync.filter$(group ? { ...where, group } : where));
};

const useById = <T extends ModelBase>(sync: Sync<T>, _where?: Where<T>) => useMsg(sync.up$);

export const useDevice = () => useItemKey(deviceSync, useDeviceKey());
export const useMedia = () => useItemKey(mediaSync, useMediaKey());
export const useGroup = () => useItemKey(groupSync, useGroupKey());

export const useGroups = () => useItems(groupSync);
export const useGroupMembers = () => useGroupItems(memberSync);
export const useGroupDevices = () => useGroupItems(deviceSync);
export const useGroupMedias = (type?: MediaModel['type']) => {
  const allMedias = useGroupItems(mediaSync);
  const isAdvanced = useIsAdvanced();
  return useMemo(() => {
    let medias = allMedias;
    if (!isAdvanced) medias = medias.filter((m) => !m.title.startsWith('.'));
    if (type) medias = medias.filter((m) => m.type === type || m.type === 'folder');
    return medias;
  }, [allMedias, isAdvanced, type]);
};
export const useGroupJobs = () => useGroupItems(jobSync);

export const useGroupById = () => useById(groupSync);
export const useMemberById = () => useById(memberSync);
export const useDeviceById = () => useById(deviceSync);
export const useMediaById = () => useById(mediaSync);
export const useJobById = () => useById(jobSync);
