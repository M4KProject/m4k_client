import { addResponsiveListener } from '@common/ui';
import { getUrlQuery } from '@common/ui/getUrlQuery';
import { isDevice$ } from './messages';
import './app';

addResponsiveListener();

const main = () => {
  const query = getUrlQuery();

  if (query.device !== undefined) {
    isDevice$.set(!!query.device);
  }

  if (isDevice$.v) {
    import('./device/index').then(m => m.mount());
    return;
  }

  import('./admin/index').then(m => m.mount());
}

main();
