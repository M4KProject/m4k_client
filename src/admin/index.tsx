import { render } from 'preact';
import { App } from './components/App';
import { addFont, refreshTheme, addEl, addResponsiveListener, setCss } from '@common/ui';
import { authRefresh } from '@common/api';
import { appAssign } from '@common/utils';
import * as utils from '@common/utils';
import * as ui from '@common/ui';
import * as api from '@common/api';
import * as colls from '../api/sync';
import * as routerGetters from '../router/getters';
import * as routerSetters from '../router/setters';
import * as routerMsg from '../router/msgs';
import * as controllers from './controllers';

appAssign(utils, ui, api, colls, routerGetters, routerSetters, routerMsg, controllers);

console.debug('loaded');

let _rootEl: HTMLElement | null = null;

export const mount = () => {
  console.debug('admin mount');

  addResponsiveListener();
  addFont('Roboto');
  refreshTheme();

  setCss('fontFamily', { ',html,body': { fontFamily: 'Roboto' } });

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
