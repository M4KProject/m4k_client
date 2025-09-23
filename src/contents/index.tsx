import { render } from 'preact';
import { addFont, refreshTheme, addEl, addResponsiveListener } from '@common/ui';
import { ContentViewer } from './ContentViewer';

console.debug('content loaded');

let _rootEl: HTMLElement | null = null;

export const mount = () => {
  console.debug('mount content');

  addResponsiveListener();
  addFont('Roboto');
  refreshTheme();

  const contentKey = null; // router.current.params.contentKey;

  _rootEl = addEl('div', { id: 'm4kContent', parent: 'body' });
  render(<ContentViewer contentKey={contentKey} />, _rootEl);

  console.debug('content mounted', { contentKey });
};

export const unmount = () => {
  console.debug('unmount content');

  if (_rootEl) {
    _rootEl.remove();
    _rootEl = null;
  }
};
