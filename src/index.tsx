import './app';
import { addResponsiveListener } from '@common/ui';
import { isNil, logger } from 'fluxio';
import { m4k } from '@common/m4k';
import { mountDevice } from './device/mountDevice';
import { mountAdmin } from './admin/mountAdmin';
import { initServiceWorker } from './initServiceWorker';
import { isDevice$ } from './router/isDevice$';
import { getPbClient } from 'pocketbase-lite';

const log = logger('main');

const initPbUrl = () => {
  const host = location.host;
  const pbClient = getPbClient();
  log.d('host', host);
  if (host.includes(':')) {
    const prevApiUrl = pbClient.getApiUrl();
    log.d('prevApiUrl', prevApiUrl);
    if (!prevApiUrl) {
      const nextApiUrl = 'https://i.m4k.fr/api/';
      log.d('set url', prevApiUrl, nextApiUrl);
      pbClient.setApiUrl(nextApiUrl);
    }
  }
};

const main = async () => {
  log.d('start');

  addResponsiveListener();
  initServiceWorker();
  initPbUrl();

  let isDevice = isDevice$.get();
  log.d('isDevice', isDevice);

  if (isNil(isDevice)) {
    if (m4k.isInterface) {
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
