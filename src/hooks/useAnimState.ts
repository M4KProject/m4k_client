import { onTimeout } from 'fluxio';
import { useEffect, useState } from 'preact/hooks';

export type AnimState = 'show'|'showing'|'hide'|'hiding';

export const useAnimState = (show: boolean, duration: number = 300): AnimState => {
  const [state, setState] = useState<AnimState>('hide');

  useEffect(() => {
    if (show) {
      switch (state) {
        case 'hide':
        case 'hiding':
          return onTimeout(() => setState('showing'), 10);
        case 'showing':
          return onTimeout(() => setState('show'), duration);
      }
    } else {
      switch (state) {
        case 'show':
        case 'showing':
          return onTimeout(() => setState('hiding'), 10);
        case 'hiding':
          return onTimeout(() => setState('hide'), duration);
      }
    }
  }, [state, show, duration]);

  return state;
};
