import { useFlux } from './useFlux';
import { Router } from '@/controllers/Router';
import { useSingleton } from './useSingleton';

export const useRouter = () => useSingleton(Router);

export const usePage = () => useFlux(useRouter().page$);
export const useIsKiosk = () => useFlux(useRouter().isKiosk$);
export const useIsAdvanced = () => useFlux(useRouter().isAdvanced$);