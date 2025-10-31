import { Css } from '@common/ui';
import { useFlux } from '@common/hooks';
import { dialog$ } from '../messages/dialog$';

const c = Css('DialogContainer', {
  '': {
    position: 'fixed',
    inset: 0,
    bg: 'mask',
    fCenter: [],
    zIndex: 10000,
  },
  Window: {
    fCol: [],
    elevation: 3,
    rounded: 2,
    maxWidth: '90%',
    minWidth: '400px',
    overflow: 'hidden',
    bg: 'b0',
  },
  Header: {
    fCenter: [],
    textAlign: 'center',
    bold: 1,
    p: 1,
    bg: 'header',
    fg: 'headerTitle',
  },
  Content: {
    fCol: [],
    p: 1,
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
