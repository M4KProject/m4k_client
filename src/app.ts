import * as api from '@common/api';
import * as helpers from '@common/helpers';
import { global } from '@common/helpers';
import * as controllers from './controllers';
import * as messages from './messages';

export const app = global.app || (global.app = {});

app.app = app;

Object.assign(app, api);
Object.assign(app, helpers);
Object.assign(app, messages);
Object.assign(app, controllers);