import { render } from 'preact';
import { addAutoHideListener, addFont } from '@common/helpers';
import { setTheme } from '@common/helpers';
import { addEl, addResponsiveListener } from '@common/helpers';
import { setDefaultOptions } from 'date-fns';
import { fr } from 'date-fns/locale';
import copyPlaylist from './copyPlaylist';
import { deviceInit } from './services/device';
import { m4k } from '@common/m4k';
import { App } from './components/App';

console.debug('loaded');

let _rootEl: HTMLElement|null = null;

export const mount = () => {
  console.debug('mount device');

  setDefaultOptions({ locale: fr });
  addResponsiveListener();
  addAutoHideListener();
  addFont('Roboto');
  setTheme('#28A8D9');

  _rootEl = addEl('div', { id: 'm4kDevice', parent: 'body' })
  render(<App />, _rootEl);

  deviceInit();

  m4k.subscribe(async e => {
    if (e.type !== 'storage' || e.action !== 'mounted') return;
    await copyPlaylist(`${e.path}/playlist`);
  });

  console.debug('device mounted');
}

export const unmount = () => {
  console.debug('unmount device');

  if (_rootEl) {
    _rootEl.remove();
    _rootEl = null;
  }
}