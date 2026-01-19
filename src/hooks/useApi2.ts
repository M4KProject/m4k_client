import { useFlux } from '@/hooks/useFlux';
import { api2, ApiRest, MBase } from '@/api2';

const getUseDico = <T extends MBase>(rest: ApiRest<T>) => () => useFlux(rest.dico$);
const getUseItems = <T extends MBase>(rest: ApiRest<T>) => () => useFlux(rest.items$);
const getUseItem = <T extends MBase>(rest: ApiRest<T>) => () => useFlux(rest.item$);
const getUseId = <T extends MBase>(rest: ApiRest<T>) => () => useFlux(rest.id$);

export const useApplicationDico = getUseDico(api2.applications);
export const useDeviceDico = getUseDico(api2.devices);
export const useGroupDico = getUseDico(api2.groups);
export const useJobDico = getUseDico(api2.jobs);
export const useMediaDico = getUseDico(api2.medias);
export const useMemberDico = getUseDico(api2.members);
export const useUserDico = getUseDico(api2.users);

export const useApplications = getUseItems(api2.applications);
export const useDevices = getUseItems(api2.devices);
export const useGroups = getUseItems(api2.groups);
export const useJobs = getUseItems(api2.jobs);
export const useMedias = getUseItems(api2.medias);
export const useMembers = getUseItems(api2.members);
export const useUsers = getUseItems(api2.users);

export const useApplication = getUseItem(api2.applications);
export const useDevice = getUseItem(api2.devices);
export const useGroup = getUseItem(api2.groups);
export const useJob = getUseItem(api2.jobs);
export const useMedia = getUseItem(api2.medias);
export const useMember = getUseItem(api2.members);
export const useUser = getUseItem(api2.users);

export const useApplicationId = getUseId(api2.applications);
export const useDeviceId = getUseId(api2.devices);
export const useGroupId = getUseId(api2.groups);
export const useJobId = getUseId(api2.jobs);
export const useMediaId = getUseId(api2.medias);
export const useMemberId = getUseId(api2.members);
export const useUserId = getUseId(api2.users);

export const useAuth = () => useFlux(api2.client.auth$);


