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
import { App } from './components/App';

console.debug('loaded');

let _rootEl: HTMLElement | null = null;

export const mount = () => {
  console.debug('mount device');

  addResponsiveListener();
  addAutoHideListener();
  addFont('Roboto');
  refreshTheme();

  _rootEl = addEl('div', { id: 'm4kDevice', parent: 'body' });
  render(<App />, _rootEl);

  deviceInit();

  m4k.subscribe(async (e) => {
    if (e.type !== 'storage' || e.action !== 'mounted') return;
    await copyPlaylist(`${e.path}/playlist`);
  });

  console.debug('device mounted');
};

export const unmount = () => {
  console.debug('unmount device');

  if (_rootEl) {
    _rootEl.remove();
    _rootEl = null;
  }
};
