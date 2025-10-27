import './app';
import { addResponsiveListener } from '@common/ui';
import { isNil, fluxStored, isBoolean } from 'fluxio';
import { m4k } from '@common/m4k';
import { mountDevice } from './device/mountDevice';
import { mountAdmin } from './admin/mountAdmin';
import { initServiceWorker } from './initServiceWorker';

export const isDevice$ = fluxStored<boolean>('isDevice$', false, isBoolean);

addResponsiveListener();

initServiceWorker();

const main = async () => {
  let isDevice = isDevice$.get();

  if (isNil(isDevice)) {
    if (m4k.isInterface) {
      isDevice = true;
    }
  }

  if (isDevice) {
    await mountDevice();
  } else {
    await mountAdmin();
  }
};

main();
