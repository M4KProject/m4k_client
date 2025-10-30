import { groupId$ } from './groupId$';
import { GroupModel, MediaModel } from './models';
import { useFlux } from '@common/hooks';
import { deviceSync, groupSync, jobSync, mediaSync, memberSync, Sync } from './sync';
import { useDeviceKey, useGroupKey, useMediaKey, useIsAdvanced } from '../router/hooks';
import { useMemo } from 'preact/hooks';
import { PbModel, PbWhere } from 'pocketbase-lite';

const useItemKey = <T extends PbModel & { key?: string }>(
  sync: Sync<T>,
  key?: string
): T | undefined => useFlux(key ? sync.find$({ key }) : undefined) as T | undefined;

const useItems = <T extends PbModel>(sync: Sync<T>, whereOrId?: PbWhere<T>): T[] => {
  const items = useFlux(sync.filter$(whereOrId));
  return items || [];
};

const useGroupItems = <T extends PbModel & { group?: string }>(
  sync: Sync<T>,
  where?: PbWhere<T>
): T[] => {
  const group = useFlux(groupId$);
  const items = useFlux(sync.filter$(group ? ({ ...where, group } as PbWhere<T>) : where));
  return items || [];
};

const useById = <T extends PbModel>(sync: Sync<T>, _where?: PbWhere<T>) => useFlux(sync.up$);

export const useDevice = () => useItemKey(deviceSync, useDeviceKey());
export const useMedia = () => useItemKey(mediaSync, useMediaKey());
export const useGroup = () => useItemKey(groupSync, useGroupKey());

export const useGroups = (): GroupModel[] => useItems(groupSync) as GroupModel[];
export const useGroupMembers = () => useGroupItems(memberSync);
export const useGroupDevices = () => useGroupItems(deviceSync);
export const useGroupMedias = (type?: MediaModel['type']) => {
  const allMedias = useGroupItems(mediaSync);
  const isAdvanced = useIsAdvanced();
  return useMemo(() => {
    let medias = allMedias;
    if (!isAdvanced) medias = medias.filter((m) => !m.title?.startsWith('.'));
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
