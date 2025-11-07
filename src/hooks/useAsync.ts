import { useMemo, useEffect } from 'preact/hooks';
import { flux, Flux, fluxStored } from 'fluxio';
import { useFlux } from './useFlux';
import { toError } from 'fluxio';

export const useAsync = <T>(
  initValue: T,
  load: () => T | Promise<T>,
  storedKey?: string | null,
  deps?: any[]
): [T, () => void, Flux<T>] => {
  const _deps = deps ? [...deps, storedKey] : [storedKey];

  // import { isArray, isDefined } from "fluxio";
  // const msg = useMemo(() => {
  //     const msg = fluxStored<T>(initValue, storedKey, !!storedKey);
  //     if (isDefined(initValue) && (typeof msg.v !== typeof initValue || isArray(msg.v) !== isArray(initValue))) {
  //         msg.set(initValue);
  //     }
  //     return msg;
  // }, _deps);

  const msg = useMemo(
    () => (storedKey ? fluxStored<T>(storedKey, initValue) : flux(initValue)),
    _deps
  );

  const reload = async () => {
    const value = await load();
    msg.set(value);
  };

  useEffect(() => {
    reload().catch((e) => {
      const error = toError(e);
      console.error('useAsync load', storedKey, error);
      if (!storedKey) throw error;
    });
  }, _deps);

  const value = useFlux(msg);

  return [value, reload, msg];
};
