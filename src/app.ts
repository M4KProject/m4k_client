import { glb } from 'fluxio';

import * as fluxio from 'fluxio';
import * as pb from 'pblite';
import { bridge } from './bridge';

export const app = glb.m4k || (glb.m4k = {});

Object.assign(app, fluxio, pb, bridge);
