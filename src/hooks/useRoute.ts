import { useFlux } from './useFlux';
import { Router } from '@/controllers/Router';
import { useSingleton } from './useSingleton';

export const useRouter = () => useSingleton(Router);

export const useRoute = () => useFlux(useRouter().route$);

export const usePage = () => useFlux(useRouter().page$);
export const useGroupKey = () => useFlux(useRouter().groupKey$);
export const useMediaKey = () => useFlux(useRouter().mediaKey$);
export const useDeviceKey = () => useFlux(useRouter().deviceKey$);

export const useIsKiosk = () => useFlux(useRouter().isKiosk$);
export const useIsAdvanced = () => useFlux(useRouter().isAdvanced$);

export const useGroup = () => useFlux(useRouter().group$);
export const useMedia = () => useFlux(useRouter().media$);
export const useDevice = () => useFlux(useRouter().device$);

export const useGroupId = () => useFlux(useRouter().groupId$);
export const useMediaId = () => useFlux(useRouter().mediaId$);
export const useDeviceId = () => useFlux(useRouter().deviceId$);
