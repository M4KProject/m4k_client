import { render } from 'preact';
import { App } from './components/App';
import { setEl, setCss } from 'fluxio';
import { getPbClient } from 'pblite';
import { addResponsiveListener } from '@/utils/responsive';
import { addFont } from '@/utils/addFont';
import { refreshTheme } from '@/utils/theme';

console.debug('loaded');

let _rootEl: HTMLElement | null = null;

export const mountAdmin = () => {
  console.debug('admin mount');

  addResponsiveListener();
  addFont('Roboto');
  refreshTheme();

  setCss('fontFamily', { ',html,body': { fontFamily: 'Roboto' } });

  _rootEl = setEl('div', { id: 'm4kAdmin', parent: 'body' });
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
