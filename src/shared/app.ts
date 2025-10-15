import { global } from '@common/utils';

import * as utils from '@common/utils';
import * as ui from '@common/ui';
import * as api from '@common/api';
import * as colls from '../api/sync';
import * as routerGetters from '../router/getters';
import * as routerSetters from '../router/setters';
import * as routerMsg from '../router/msgs';

export const app = global._app || (global._app = {});

Object.assign(app, utils, ui, api, colls, routerGetters, routerSetters, routerMsg);
