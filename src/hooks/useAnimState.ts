import { onTimeout } from 'fluxio';
import { useEffect, useState } from 'preact/hooks';

export type AnimState = 'unmounted' | 'mounted' | 'entering' | 'entered' | 'exiting';

export const useAnimState = (show: boolean, duration: number): AnimState => {
  const [state, setState] = useState<AnimState>('unmounted');

  useEffect(() => {
    if (show) {
      if (state === 'unmounted') return setState('mounted');
      if (state === 'mounted') return onTimeout(() => setState('entering'), 10);
      if (state !== 'entered') return onTimeout(() => setState('entered'), duration);
    } else {
      if (state === 'entered') return setState('exiting');
      if (state !== 'unmounted') return onTimeout(() => setState('unmounted'), duration);
    }
  }, [state, show, duration]);

  return state;
};

export const isAnimStateOpen = (animState: AnimState) =>
  animState === 'entered' || animState === 'entering';
