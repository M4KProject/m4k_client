import { render } from 'preact';
import { addFont } from '@common/helpers';
import { setTheme } from '@common/helpers';
import { addEl, addResponsiveListener } from '@common/helpers';
import { setDefaultOptions } from 'date-fns';
import { fr } from 'date-fns/locale';
import { InitDevice } from './device/InitDevice';

console.debug('loaded');

let _rootEl: HTMLElement|null = null;

export const mount = () => {
  console.debug('mount device');

  setDefaultOptions({ locale: fr });
  addResponsiveListener();
  addFont('Roboto');
  setTheme('#28A8D9');

  _rootEl = addEl('div', { id: 'm4kDevice', parent: 'body' })
  render(<InitDevice />, _rootEl);

  console.debug('device mounted');
}

export const unmount = () => {
  console.debug('unmount device');

  if (_rootEl) {
    _rootEl.remove();
    _rootEl = null;
  }
}