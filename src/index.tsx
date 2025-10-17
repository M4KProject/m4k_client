import { addResponsiveListener } from '@common/ui';
import { isBool, isNil, Msg } from '@common/utils';
import { global } from '@common/utils';
import './shared/app';

export const isDevice$ = new Msg<boolean>(false, 'isDevice$', true, isBool);

addResponsiveListener();

const main = () => {
  let isDevice = isDevice$.v;

  if (isNil(isDevice)) {
    const w = global;
    if (w._m4k || w.fully) {
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
