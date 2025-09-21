import { Css, flexCenter, flexColumn } from '@common/ui';
import { useMsg } from '@common/hooks';
import { Div } from '@common/components';
import { dialog$ } from '../messages/dialog$';

const css = Css('DialogContainer', {
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
    <Div  cls={css()} onClick={() => dialog.onClose?.()}>
      <Div cls={css(`Window`)} onClick={(e) => e.stopPropagation()}>
        <Div cls={css(`Header`)}>{dialog.title}</Div>
        <Div cls={css(`Content`)}>
          <dialog.content />
        </Div>
      </Div>
    </Div>
  );
};
