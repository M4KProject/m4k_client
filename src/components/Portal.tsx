import { render } from 'preact';
import { createPortal } from 'preact/compat';
import { useEffect } from 'preact/hooks';
import { setEl, ElOptions } from 'fluxio';
import { logger } from 'fluxio/logger';
import { useConstant } from '@/hooks/useConstant';
import { Content } from './types';
import { getContent } from './getContent';

const log = logger('portal');

export const portal = (content: Content, options?: ElOptions) => {
  const el = setEl('div', { parent: 'body', ...options });
  log.d('add');
  render(getContent(content), el);
  return () => {
    log.d('remove');
    render(null, el);
    el.remove();
  };
};

// export const Portal2 = ({ children, options }: { children: ComponentChildren; options?: ElOptions }) => {
//   useEffect(() => portal(children, options), [children, options]);
//   return null;
// };

export const Portal = ({ children, options }: { children: Content; options?: ElOptions }) => {
  const el = useConstant(() => setEl('div', { parent: 'body', ...options }));
  useEffect(() => () => el.remove(), []);
  return createPortal(getContent(children), el);
};
