import { global } from '@common/utils';

import * as utils from '@common/utils';
import * as ui from '@common/ui';
import * as api from '@common/api';
import * as colls from './api/sync';

export const app = global._app || (global._app = {});

Object.assign(app, utils, ui, api, colls);
