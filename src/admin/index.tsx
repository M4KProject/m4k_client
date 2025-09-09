import { render } from 'preact';
import { App } from './components/App';
import { initAdminRouter } from './controllers/Router';
import { addFont } from '@common/helpers';
import { setTheme } from '@common/helpers';
import { addEl, addResponsiveListener, setCss } from '@common/helpers';
import { authRefresh } from '@common/api';
import { app } from '../app';
import * as controllers from './controllers';
import * as messages from './messages';

console.debug('loaded');

let _rootEl: HTMLElement | null = null;

Object.assign(app, controllers);
Object.assign(app, messages);

export const mount = () => {
  console.debug('admin mount');

  addResponsiveListener();
  addFont('Roboto');
  setTheme('#28A8D9');

  setCss('font', { 'html,body': { fontFamily: 'Roboto' } });

  initAdminRouter();

  _rootEl = addEl('div', { id: 'm4kAdmin', parent: 'body' });
  render(<App />, _rootEl);

  console.debug('admin mounted');
  authRefresh();
};

export const unmount = () => {
  console.debug('admin unmount');

  if (_rootEl) {
    _rootEl.remove();
    _rootEl = null;
  }
};
