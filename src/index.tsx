import { addResponsiveListener } from '@common/ui';
import { getUrlQuery } from '@common/ui/getUrlQuery';
import { isBool, Msg } from '@common/utils';
import './shared/app';

export const isDevice$ = new Msg(false, 'isDevice$', true, isBool);

addResponsiveListener();

const main = () => {
  const { d } = getUrlQuery();

  if (d) {
    isDevice$.set(!!d);
  }

  if (isDevice$.v) {
    import('./device/index').then((m) => m.mount());
    return;
  }

  import('./admin/index').then((m) => m.mount());
};

main();
