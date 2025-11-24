import { RouteController } from '@/controllers/RouteController';
import { useSingleton } from './useSingleton';

export const useRouteController = () => useSingleton(RouteController);
