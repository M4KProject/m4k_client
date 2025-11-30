import { render } from 'preact';
import { createPortal } from 'preact/compat';
import { useEffect } from 'preact/hooks';
import { setEl, ElOptions } from 'fluxio';
import { useConstant } from '@/hooks/useConstant';
import { comp, Comp } from '@/utils/comp';

export const portal = (content: Comp, options?: ElOptions) => {
  // console.debug('portal', content, options);
  const el = setEl('div', { parent: 'body', cls: 'portal', ...options });
  render(comp(content), el);
  return () => {
    // console.debug('portal remove', content, options);
    render(null, el);
    el.remove();
  };
};

// export const Portal2 = ({ children, options }: { children: ComponentChildren; options?: ElOptions }) => {
//   useEffect(() => portal(children, options), [children, options]);
//   return null;
// };

export const Portal = ({ children, options }: { children: Comp; options?: ElOptions }) => {
  const el = useConstant(() => setEl('div', { parent: 'body', ...options }));
  useEffect(() => () => el.remove(), []);
  return createPortal(comp(children), el);
};
