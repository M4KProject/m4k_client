import { useMsg } from '@common/hooks/useMsg';
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
} from './msgs';

export const useRoute = () => useMsg(route$);

export const usePage = () => useMsg(page$);

export const useIsEdit = () => useMsg(isEdit$);
export const useIsAdmin = () => useMsg(isAdmin$);
export const useIsAdvanced = () => useMsg(isAdvanced$);

export const useMediaType = () => useMsg(mediaType$);

export const useMediaKey = () => useMsg(mediaKey$);
export const useGroupKey = () => useMsg(groupKey$);
export const useDeviceKey = () => useMsg(deviceKey$);
