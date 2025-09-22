import { render } from 'preact';
import { App } from './components/App';
import { addFont, setTheme, addEl, addResponsiveListener, setCss } from '@common/ui';
import { authRefresh } from '@common/api';
import { app } from '../app';
import * as messages from './messages';

console.debug('loaded');

let _rootEl: HTMLElement | null = null;

Object.assign(app, messages);

export const mount = () => {
  console.debug('admin mount');

  addResponsiveListener();
  addFont('Roboto');
  setTheme();

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
