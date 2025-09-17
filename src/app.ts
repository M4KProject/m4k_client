import * as helpers from '@common/utils';
import { global } from '@common/utils';

export const app = global.app || (global.app = {});

app.app = app;

Object.assign(app, helpers);
