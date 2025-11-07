import { render } from 'preact';
import { setEl, ElOptions } from 'fluxio';
import { ComponentChildren } from 'preact';
import { logger } from 'fluxio/logger';

const log = logger('portal');

export const portal = (content: ComponentChildren, o?: ElOptions) => {
  const el = setEl('div', { parent: 'body', ...o });
  log.d('add', el);
  render(content, el);
  return () => {
    log.d('remove');
    render(null, el);
    el.remove();
  };
};
