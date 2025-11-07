import { useFlux } from '@/hooks/useFlux';
import {
  route$,
  page$,
  isEdit$,
  isAdmin$,
  isAdvanced$,
  mediaType$,
  mediaKey$,
  groupKey$,
  deviceKey$,
} from './flux';

export const useRoute = () => useFlux(route$);

export const usePage = () => useFlux(page$);

export const useIsEdit = () => useFlux(isEdit$);
export const useIsAdmin = () => useFlux(isAdmin$);
export const useIsAdvanced = () => useFlux(isAdvanced$);

export const useMediaType = () => useFlux(mediaType$);

export const useMediaKey = () => useFlux(mediaKey$);
export const useGroupKey = () => useFlux(groupKey$);
export const useDeviceKey = () => useFlux(deviceKey$);
