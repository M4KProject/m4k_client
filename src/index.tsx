import { addResponsiveListener } from '@common/ui';
import { isBool, isNil, Msg } from '@common/utils';
import { m4k } from '@common/m4k';
import './shared/app';

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
