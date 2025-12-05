import { useFlux } from './useFlux';
import { Router } from '@/controllers/Router';
import { useSingleton } from './useSingleton';

export const useRouter = () => useSingleton(Router);

export const useRoute = () => useFlux(useRouter().route$);

export const useRoutePage = () => useFlux(useRouter().routePage$);
export const useRouteGroup = () => useFlux(useRouter().routeGroup$);
export const useRouteMedia = () => useFlux(useRouter().routeMedia$);
export const useRouteDevice = () => useFlux(useRouter().routeDevice$);

export const useIsKiosk = () => useFlux(useRouter().isKiosk$);
export const useIsAdvanced = () => useFlux(useRouter().isAdvanced$);

export const useGroup = () => useFlux(useRouter().group$);
export const useMedia = () => useFlux(useRouter().media$);
export const useDevice = () => useFlux(useRouter().device$);

export const useGroupId = () => useFlux(useRouter().groupId$);
export const useMediaId = () => useFlux(useRouter().mediaId$);
export const useDeviceId = () => useFlux(useRouter().deviceId$);
