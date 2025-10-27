import { glb } from 'fluxio';

import * as fluxio from 'fluxio';
import * as ui from '@common/ui';
import * as api from '@/api';
import * as routerGetters from './router/getters';
import * as routerSetters from './router/setters';
import * as routerFlux from './router/flux';

export const app = glb.app || (glb.app = {});

Object.assign(app, fluxio, ui, api, routerGetters, routerSetters, routerFlux);
