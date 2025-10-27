import { render } from 'preact';
import {
  refreshTheme,
  addAutoHideListener,
  addResponsiveListener,
  addEl,
  addFont,
} from '@common/ui';
import copyPlaylist from './copyPlaylist';
import { deviceInit } from './services/device';
import { m4k } from '@common/m4k';
import { DeviceApp } from './components/DeviceApp';
import { copyDir$ } from './messages';
import { logger } from 'fluxio';

const log = logger('mountDevice');
log.d('loaded');

let _rootEl: HTMLElement | null = null;

export const mountDevice = () => {
  log.d('mount device');

  addResponsiveListener();
  addAutoHideListener();
  addFont('Roboto');
  refreshTheme();

  _rootEl = addEl('div', { id: 'm4kDevice', parent: 'body' });
  render(<DeviceApp />, _rootEl);

  deviceInit();

  m4k.subscribe(async (e) => {
    if (e.type !== 'storage' || e.action !== 'mounted') return;
    await copyPlaylist(`${e.path}/${copyDir$.get()}`);
  });

  log.d('device mounted');
  
  return () => {
    log.d('unmount device');

    if (_rootEl) {
      _rootEl.remove();
      _rootEl = null;
    }
  };
};
