import { render } from 'preact';
import { App } from './components/App';
import { initAdminRouter } from './controllers/Router';
import { addFont } from '@common/helpers';
import { setTheme } from '@common/helpers';
import { addEl, addResponsiveListener, setCss } from '@common/helpers';
import { setDefaultOptions } from 'date-fns';
import { fr } from 'date-fns/locale';
import { authRefresh } from '@common/api';

console.debug('loaded');

let _rootEl: HTMLElement|null = null;

export const mount = () => {
  console.debug('mount');

  setDefaultOptions({ locale: fr });
  addResponsiveListener();
  addFont('Roboto');
  setTheme('#28A8D9');

  setCss('font', { 'html,body': { fontFamily: 'Roboto' } });

  initAdminRouter();

  _rootEl = addEl('div', { id: 'm4kAdmin', parent: 'body' })
  render(<App />, _rootEl);

  console.debug('mounted');
  authRefresh();
}

export const unmount = () => {
  console.debug('unmount');

  if (_rootEl) {
    _rootEl.remove();
    _rootEl = null;
  }
}