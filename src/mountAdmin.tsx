import { render } from 'preact';
import { App } from '@/components/admin/App';

console.debug('loaded');

// let _rootEl: HTMLElement | null = null;

export const mountAdmin = () => {
  console.debug('admin mount');

  // addResponsiveListener();

  // _rootEl = setEl('div', { id: 'app', parent: 'body' });
  render(<App />, document.body);

  console.debug('admin mounted');

  // return () => {
  //   console.debug('admin unmount');
  //   if (_rootEl) {
  //     _rootEl.remove();
  //     _rootEl = null;
  //   }
  // };
};
