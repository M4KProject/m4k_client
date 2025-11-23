import './app';
import { logger } from 'fluxio';
import { initServiceWorker } from '@/initServiceWorker';
import { render } from 'preact';
import { App } from '@/components/App';

const log = logger('main');

const main = async () => {
  log.d('start');

  initServiceWorker();
  render(<App />, document.body);
};

main();

  // addResponsiveListener();
  // let isDevice = isDevice$.get();
  // log.d('isDevice', isDevice);

  // if (isNil(isDevice)) {
  //   if (bridge.isInterface) {
  //     isDevice = true;
  //     log.d('isInterface');
  //   }
  // }


  // if (isDevice) {
  //   log.d('mountDevice');
  //   await mountDevice();
  // } else {
  //   log.d('mountAdmin');
  //   await mountAdmin();
  // }