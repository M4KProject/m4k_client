import { addResponsiveListener } from '@common/ui';
import { getUrlQuery } from '@common/ui/getUrlQuery';
import './app';
import { isFun, isItem } from '@common/utils';

addResponsiveListener();

const main = () => {
  const query = getUrlQuery();
  if (query.device !== false) {
    const isDevice = localStorage.getItem('isDevice') || query.device;
    if (isDevice) {
      import('./device').then(module => {
        console.debug('device module', module);
        if (isItem(module) && isFun(module.mount)) module.mount();
      });
      return;
    }
  }

  import('./admin').then(module => {
    console.debug('admin module', module);
    if (isItem(module) && isFun(module.mount)) module.mount();
  });
}

main();
