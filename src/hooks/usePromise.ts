import { toVoid } from 'fluxio';
import { useEffect, useState } from 'preact/hooks';

export interface IPromise<T> {
  then: (cb: (value: T) => any) => any;
  catch?: (cb: (reason: any) => any) => any;
}

const _refresh = <T>(
  constructor: () => IPromise<T> | null | undefined,
  setResult: (
    value:
      | [T | undefined, any, boolean, () => void]
      | ((
          prev: [T | undefined, any, boolean, () => void]
        ) => [T | undefined, any, boolean, () => void])
  ) => void
) => {
  let isMounted = true;

  const refresh = () => {
    isMounted = false;
    _refresh(constructor, setResult);
  };

  // Init loading
  setResult([undefined, undefined, true, refresh]);

  const promise = constructor();
  if (promise) {
    promise.then((value) => {
      if (isMounted) setResult([value, undefined, false, refresh]);
    });
    if (promise.catch) {
      promise.catch((error) => {
        if (isMounted) setResult([undefined, error, false, refresh]);
      });
    }
  }

  return () => {
    isMounted = false;
  };
};

/**
 * Custom hook to handle promise-based operations with loading and error states
 * @param constructor A function that returns a Promise, null, or undefined
 * @param deps Dependency array that triggers re-execution of the promise
 * @returns [value, error, isLoading, refresh] - Tuple containing result value, error state, and loading indicator
 */
export const usePromise = <T>(
  constructor: () => IPromise<T> | null | undefined,
  deps: any[]
): [T | undefined, any, boolean, () => void] => {
  const [result, setResult] = useState<[T | undefined, any, boolean, () => void]>([
    undefined,
    undefined,
    true,
    toVoid,
  ]);
  useEffect(() => _refresh(constructor, setResult), deps); // eslint-disable-line react-hooks/exhaustive-deps
  return result;
};
