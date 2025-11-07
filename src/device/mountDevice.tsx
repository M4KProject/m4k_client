import { render } from 'preact';
import { setEl } from 'fluxio';
import copyPlaylist from './copyPlaylist';
import { deviceInit } from './services/device';
import { m4k } from '@/m4kBridge';
import { DeviceApp } from './components/DeviceApp';
import { copyDir$ } from './messages';
import { logger } from 'fluxio';
import { addResponsiveListener } from '@/utils/responsive';
import { addAutoHideListener } from '@/utils/autoHide';
import { addFont } from '@/utils/addFont';
import { refreshTheme } from '@/utils/theme';

const log = logger('mountDevice');
log.d('loaded');

let _rootEl: HTMLElement | null = null;

export const mountDevice = () => {
  log.d('mount device');

  addResponsiveListener();
  addAutoHideListener();
  addFont('Roboto');
  refreshTheme();

  _rootEl = setEl('div', { id: 'm4kDevice', parent: 'body' });
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
