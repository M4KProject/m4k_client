import { Css } from 'fluxio';
import { dialog$ } from '../messages/dialog$';
import { useFlux } from '@/hooks/useFlux';

const c = Css('DialogContainer', {
  '': {
    position: 'fixed',
    inset: 0,
    bg: 'mask',
    center: 1,
    zIndex: 10000,
  },
  Window: {
    col: 1,
    elevation: 3,
    rounded: 5,
    maxWidth: '90%',
    minWidth: '400px',
    overflow: 'hidden',
    bg: 'bg',
  },
  Header: {
    center: 1,
    textAlign: 'center',
    bold: 1,
    p: 8,
    bg: 'header',
    fg: 'headerTitle',
  },
  Content: {
    col: 1,
    p: 8,
  },
});

export const DialogContainer = () => {
  const dialog = useFlux(dialog$);

  if (!dialog) return null;

  return (
    <div {...c()} onClick={() => dialog.onClose?.()}>
      <div {...c('Window')} onClick={(e) => e.stopPropagation()}>
        <div {...c('Header')}>{dialog.title}</div>
        <div {...c('Content')}>
          <dialog.content />
        </div>
      </div>
    </div>
  );
};
