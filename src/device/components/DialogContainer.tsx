import { Css, flexCenter, flexColumn } from '@common/ui';
import { useMsg } from '@common/hooks';

import { dialog$ } from '../messages/dialog$';

const c = Css('DialogContainer', {
  '&': {
    position: 'fixed',
    inset: 0,
    bg: '#000000AA',
    ...flexCenter(),
    zIndex: 10000,
  },
  '&Window': {
    ...flexColumn(),
    elevation: 3,
    rounded: 2,
    maxWidth: '90%',
    minWidth: '400px',
    overflow: 'hidden',
    bg: 'bg',
  },
  '&Header': {
    ...flexCenter(),
    textAlign: 'center',
    fontSize: 1.2,
    fontWeight: 'bold',
    p: 1,
    bg: 'header',
    fg: 'headerTitle',
  },
  '&Content': {
    ...flexColumn(),
    p: 1,
  },
};

export const DialogContainer = () => {
  const dialog = useMsg(dialog$);

  if (!dialog) return null;

  return (
    <div  class={c()} onClick={() => dialog.onClose?.()}>
      <div class={c('Window')} onClick={(e) => e.stopPropagation()}>
        <div class={c('Header')}>{dialog.title}</div>
        <div class={c('Content')}>
          <dialog.content />
        </div>
      </div>
    </div>
  );
};
