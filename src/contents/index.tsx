import { render } from 'preact';
import { addFont } from '@common/helpers';
import { setTheme } from '@common/helpers';
import { addEl, addResponsiveListener } from '@common/helpers';
import { setDefaultOptions } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ContentViewer } from './ContentViewer';
import { router } from '@common/helpers';

console.debug('content loaded');

let _rootEl: HTMLElement | null = null;

export const mount = () => {
  console.debug('mount content');

  setDefaultOptions({ locale: fr });
  addResponsiveListener();
  addFont('Roboto');
  setTheme('#28A8D9');

  const contentKey = router.current.params.contentKey;

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
