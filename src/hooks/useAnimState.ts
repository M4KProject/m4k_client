import { onTimeout } from 'fluxio';
import { useEffect, useState } from 'preact/hooks';

export type AnimState = 'unmounted' | 'entering' | 'entered' | 'exiting';

export const useAnimState = (show: boolean, duration: number): AnimState => {
  const [state, setState] = useState<AnimState>('unmounted');

  useEffect(() => {
    if (show) {
      if (state === 'unmounted') setState('entering');
      else if (state === 'entering') return onTimeout(() => setState('entered'), duration);
    } else {
      if (state === 'entered') setState('exiting');
      else if (state === 'exiting') return onTimeout(() => setState('unmounted'), duration);
    }
  }, [state, show, duration]);

  return state;
};
