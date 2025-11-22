import { glb } from 'fluxio';

import * as fluxio from 'fluxio';
import * as pb from 'pblite';
import * as router from './router';
import { bridge } from './bridge';

export const app = glb._app || (glb._app = {});

Object.assign(app, fluxio, pb, router, bridge);
