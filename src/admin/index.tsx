import { render } from 'preact';
import { App } from './components/App';
import { addFont, refreshTheme, addEl, addResponsiveListener, setCss } from '@common/ui';
import { apiError$, authRefresh } from '@common/api';
import { app } from '../app';
import * as messages from './messages';
import { showError } from '@common/components';

console.debug('loaded');

let _rootEl: HTMLElement | null = null;

Object.assign(app, messages);

export const mount = () => {
  console.debug('admin mount');

  apiError$.on(showError);

  addResponsiveListener();
  addFont('Roboto');
  refreshTheme();

  setCss('font', { 'html,body': { fontFamily: 'Roboto' } });

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
