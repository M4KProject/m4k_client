import { useFlux } from './useFlux';
import { RouteController } from '@/controllers/RouteController';
import { useSingleton } from './useSingleton';

export const useRouteController = () => useSingleton(RouteController);

export const useRoute = () => useFlux(useRouteController().route$);

export const useGroupKey = () => useFlux(useRouteController().group$);
export const usePageKey = () => useFlux(useRouteController().page$);
export const useMediaKey = () => useFlux(useRouteController().media$);
export const useDeviceKey = () => useFlux(useRouteController().device$);

export const useIsKiosk = () => useFlux(useRouteController().isKiosk$);
export const useIsAdvanced = () => useFlux(useRouteController().isAdvanced$);