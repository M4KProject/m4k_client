import { Css, flexCenter, flexColumn } from '@common/helpers';
import { useCss, useMsg } from '@common/hooks';
import { Div } from '@common/components';
import { dialog$ } from '../messages/dialog$';

const css: Css = {
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
  const c = useCss('DialogContainer', css);
  const dialog = useMsg(dialog$);

  if (!dialog) return null;

  return (
    <Div cls={c} onClick={() => dialog.onClose?.()}>
      <Div cls={`${c}Window`} onClick={(e) => e.stopPropagation()}>
        <Div cls={`${c}Header`}>{dialog.title}</Div>
        <Div cls={`${c}Content`}>
          <dialog.content />
        </Div>
      </Div>
    </Div>
  );
};
