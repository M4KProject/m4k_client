import './app';
import { isNil, logger } from 'fluxio';
import { bridge } from '@/bridge';
import { mountDevice } from './mountDevice';
import { mountAdmin } from './mountAdmin';
import { initServiceWorker } from './initServiceWorker';
import { isDevice$ } from './router/isDevice$';

const log = logger('main');

const main = async () => {
  log.d('start');

  // addResponsiveListener();
  initServiceWorker();

  let isDevice = isDevice$.get();
  log.d('isDevice', isDevice);

  if (isNil(isDevice)) {
    if (bridge.isInterface) {
      isDevice = true;
      log.d('isInterface');
    }
  }

  if (isDevice) {
    log.d('mountDevice');
    await mountDevice();
  } else {
    log.d('mountAdmin');
    await mountAdmin();
  }
};

main();
