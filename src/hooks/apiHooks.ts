import { useFlux, useFluxMemo } from '@/hooks/useFlux';
import { useDeviceKey, useGroupKey, useMediaKey, useIsAdvanced } from '@/router/hooks';
import { useMemo } from 'preact/hooks';
import { PbModel, PbWhere } from 'pblite';
import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import { GroupModel, MediaModel } from '@/api/models';
import { Sync } from '@/api/sync';
import { Api } from '@/api/Api';

export const ApiContext = createContext<Api | undefined>(undefined);

export const useApi = () => useContext(ApiContext)!;

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
  const api = useApi();
  const group = useFlux(api.groupId$);
  const items = useFluxMemo(
    () => sync.filter$(group ? ({ ...where, group } as PbWhere<T>) : where),
    [sync, where, group]
  );
  return items || [];
};

const useById = <T extends PbModel>(sync: Sync<T>, _where?: PbWhere<T>) => useFlux(sync.up$);

export const useDevice = () => useItemKey(useApi().device, useDeviceKey());

export const useMedia = (key?: string) => useItemKey(useApi().media, key || useMediaKey());

export const useGroup = () => useItemKey(useApi().group, useGroupKey());

export const useGroups = (): GroupModel[] => useItems(useApi().group) as GroupModel[];

export const useGroupMembers = () => useGroupItems(useApi().member);

export const useGroupDevices = () => useGroupItems(useApi().device);

export const useGroupMedias = (type?: MediaModel['type']) => {
  const allMedias = useGroupItems(useApi().media);
  const isAdvanced = useIsAdvanced();
  return useMemo(() => {
    let medias = allMedias;
    if (!isAdvanced) medias = medias.filter((m) => !m.title?.startsWith('.'));
    if (type) medias = medias.filter((m) => m.type === type || m.type === 'folder');
    return medias;
  }, [allMedias, isAdvanced, type]);
};

export const useGroupJobs = () => useGroupItems(useApi().job);

export const useGroupById = () => useById(useApi().group);

export const useMemberById = () => useById(useApi().member);

export const useDeviceById = () => useById(useApi().device);

export const useMediaById = () => useById(useApi().media);

export const useJobById = () => useById(useApi().job);
