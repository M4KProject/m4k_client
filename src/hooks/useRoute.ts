import { useFlux } from './useFlux';
import { Router } from '@/controllers/Router';
import { useSingleton } from './useSingleton';

export const useRouter = () => useSingleton(Router);

export const useRoute = () => useFlux(useRouter().route$);

export const useGroupKey = () => useFlux(useRouter().group$);
export const usePageKey = () => useFlux(useRouter().page$);
export const useMediaKey = () => useFlux(useRouter().media$);
export const useDeviceKey = () => useFlux(useRouter().device$);

export const useIsKiosk = () => useFlux(useRouter().isKiosk$);
export const useIsAdvanced = () => useFlux(useRouter().isAdvanced$);