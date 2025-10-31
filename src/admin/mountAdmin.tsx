import { render } from 'preact';
import { App } from './components/App';
import { addFont, refreshTheme, addEl, addResponsiveListener, setCss } from '@common/ui';
import { getPbClient } from 'pblite';

console.debug('loaded');

let _rootEl: HTMLElement | null = null;

export const mountAdmin = () => {
  console.debug('admin mount');

  addResponsiveListener();
  addFont('Roboto');
  refreshTheme();

  setCss('fontFamily', { ',html,body': { fontFamily: 'Roboto' } });

  _rootEl = addEl('div', { id: 'm4kAdmin', parent: 'body' });
  render(<App />, _rootEl);

  console.debug('admin mounted');
  getPbClient().authRefresh();

  return () => {
    console.debug('admin unmount');

    if (_rootEl) {
      _rootEl.remove();
      _rootEl = null;
    }
  };
};
