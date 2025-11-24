import { useFlux } from './useFlux';
import { useRouteController } from './useRouteController';

export type { Route, Page } from '@/controllers/RouteController';

export const useRoute = () => {
  const ctrl = useRouteController();
  return useFlux(ctrl.route$);
};