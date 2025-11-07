import { useEffect } from 'preact/hooks';

type Destructor = (() => void) | void;
export type AsyncEffectCallback = () => Promise<Destructor>;

export const useAsyncEffect = (effect: AsyncEffectCallback, deps?: any[]): void => {
  useEffect(() => {
    let isMounted = true;
    let destructor: Destructor;

    effect().then((result) => {
      if (!isMounted && typeof result === 'function') {
        result();
      } else {
        destructor = result;
      }
    });

    return () => {
      isMounted = false;
      if (typeof destructor === 'function') {
        destructor();
      }
    };
  }, deps);
};
