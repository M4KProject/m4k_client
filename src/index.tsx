import { addResponsiveListener } from '@common/ui';
import { isBool, isNil, Msg } from '@common/utils';
import { m4k } from '@common/m4k';
import { appAssign } from '@common/utils';
import * as utils from '@common/utils';
import * as ui from '@common/ui';
import * as api from '@common/api';
import * as colls from './api/sync';
import * as routerGetters from './router/getters';
import * as routerSetters from './router/setters';
import * as routerMsg from './router/msgs';

appAssign(utils, ui, api, colls, routerGetters, routerSetters, routerMsg);

export const isDevice$ = new Msg<boolean>(false, 'isDevice$', true, isBool);

addResponsiveListener();

const main = () => {
  let isDevice = isDevice$.v;

  if (isNil(isDevice)) {
    if (m4k.isInterface) {
      isDevice = true;
    }
  }

  if (isDevice) {
    import('./device/index').then((m) => m.mount());
    return;
  }

  import('./admin/index').then((m) => m.mount());
};

main();
