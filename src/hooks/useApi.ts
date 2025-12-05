import { useFlux, useFluxMemo } from '@/hooks/useFlux';
import { useMemo } from 'preact/hooks';
import { PbModel, PbWhere } from 'pblite';
import { GroupModel, MediaModel } from '@/api/models';
import { Sync } from '@/api/sync';
import { Api } from '@/api/Api';
import { useSingleton } from './useSingleton';
import { useGroupId, useIsAdvanced } from './useRoute';

export const useApi = () => useSingleton(Api);

// const useItemKey = <T extends PbModel & { key?: string }>(
//   sync: Sync<T>,
//   key?: string
// ): T | undefined => useFlux(key ? sync.find$({ key }) : undefined) as T | undefined;

const useItems = <T extends PbModel>(sync: Sync<T>, whereOrId?: PbWhere<T>): T[] => {
  const items = useFlux(sync.filter$(whereOrId));
  return items || [];
};

const useGroupItems = <T extends PbModel & { group?: string }>(
  sync: Sync<T>,
  where?: PbWhere<T>
): T[] => {
  const group = useGroupId();
  const items = useFluxMemo(
    () => sync.filter$(group ? ({ ...where, group } as PbWhere<T>) : where),
    [sync, where, group]
  );
  return items || [];
};

const useById = <T extends PbModel>(sync: Sync<T>, _where?: PbWhere<T>) => useFlux(sync.up$);

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
  }, [allMedias, type]);
};

export const useGroupJobs = () => useGroupItems(useApi().job);

export const useGroupById = () => useById(useApi().group);

export const useMemberById = () => useById(useApi().member);

export const useDeviceById = () => useById(useApi().device);

export const useMediaById = () => useById(useApi().media);

export const useJobById = () => useById(useApi().job);

export const useAuth = () => useFlux(useApi().pb.auth$);
