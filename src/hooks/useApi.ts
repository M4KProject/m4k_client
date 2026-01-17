import { useFlux } from '@/hooks/useFlux';
import { useEffect, useState } from 'preact/hooks';
import { Api } from '@/api/Api';
import { useSingleton } from './useSingleton';
import { Filter, ModelBase } from '@/api/models';
import { ApiRest } from '@/api/ApiRest';
import { byId, Dictionary, jsonStringify } from 'fluxio';

export const useApi = () => useSingleton(Api);

const useItems = <T extends ModelBase>(rest: ApiRest<T>, filter?: Filter<T> | undefined, fields?: (keyof T)[] | undefined, limit?: number, offset?: number): T[] => {
  const [items, setItems] = useState<T[]>([]);
  const json = jsonStringify([filter, fields, limit, offset]);
  useEffect(() => {
    rest.list(filter, fields, limit, offset).then(setItems);
  }, [rest, json]);
  return items;
};

const getUseItems = <T extends ModelBase>(rest: ApiRest<T>) => (filter?: Filter<T> | undefined, fields?: (keyof T)[] | undefined, limit?: number, offset?: number): T[] => {
  return useItems(rest, filter, fields, limit, offset);
};

const getUseItemById = <T extends ModelBase>(rest: ApiRest<T>) => (filter?: Filter<T> | undefined, fields?: (keyof T)[] | undefined, limit?: number, offset?: number): Dictionary<T> => {
  const items = useItems(rest, filter, fields, limit, offset);
  return byId(items);
};

export const useGroups = getUseItems(useApi().groups);
export const useMembers = getUseItems(useApi().members);
export const useDevices = getUseItems(useApi().devices);
export const useMedias = getUseItems(useApi().medias);
export const useJobs = getUseItems(useApi().jobs);

export const useGroupById = getUseItemById(useApi().groups);
export const useMemberById = getUseItemById(useApi().members);
export const useDeviceById = getUseItemById(useApi().devices);
export const useMediaById = getUseItemById(useApi().medias);
export const useJobById = getUseItemById(useApi().jobs);

export const useAuth = () => useFlux(useApi().client.auth$);
