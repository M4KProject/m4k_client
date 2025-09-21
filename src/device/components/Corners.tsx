import { Css } from '@common/ui';
import { repeat } from '@common/utils';

import { openCodePinDialog } from './CodePinView';

const c = Css('Corner', {
  '&': {
    position: 'absolute',
    zIndex: 9999,
    w: 4,
    h: 4,
    m: -2,
    bg: 'red',
    opacity: 0,
    transform: 'rotate(45deg)',
    pointerEvents: 'auto',
  },
});

let count = 0;
let last = 0;

export const Corners = () => {
  const handle = () => {
    if (last + 500 < Date.now()) count = 0;
    last = Date.now();
    count++;
    console.debug('Corners handle', last, count);
    if (count > 3) {
      count = 0;
      openCodePinDialog();
    }
  };

  return (
    <>
      {repeat(4, (i) => (
        <div
          key={i}
          class={[css(), css(`-${i}`)]}
          style={{
            [i < 2 ? 'top' : 'bottom']: 0,
            [i % 2 === 0 ? 'left' : 'right']: 0,
          }}
          onClick={handle}
        />
      ))}
    </>
  );
};
