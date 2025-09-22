import { Css } from '@common/ui';
import { useMsg } from '@common/hooks';
import { dialog$ } from '../messages/dialog$';

const c = Css('DialogContainer', {
  '': {
    position: 'fixed',
    inset: 0,
    bg: '#000000AA',
    fCenter: 1,
    zIndex: 10000,
  },
  Window: {
    fCol: 1,
    elevation: 3,
    rounded: 2,
    maxWidth: '90%',
    minWidth: '400px',
    overflow: 'hidden',
    bg: 'bg',
  },
  Header: {
    fCenter: 1,
    textAlign: 'center',
    fontSize: 1.2,
    fontWeight: 'bold',
    p: 1,
    bg: 'header',
    fg: 'headerTitle',
  },
  Content: {
    fCol: 1,
    p: 1,
  },
});

export const DialogContainer = () => {
  const dialog = useMsg(dialog$);

  if (!dialog) return null;

  return (
    <div class={c()} onClick={() => dialog.onClose?.()}>
      <div class={c('Window')} onClick={(e) => e.stopPropagation()}>
        <div class={c('Header')}>{dialog.title}</div>
        <div class={c('Content')}>
          <dialog.content />
        </div>
      </div>
    </div>
  );
};
