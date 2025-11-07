import { useEffect, useState } from 'preact/hooks';

export const useTimeout = (
  callback?: (() => void) | undefined | null,
  delayMs: number = 1000,
  deps: any[] = []
): number => {
  const [[start, now], setState] = useState([0, 0]);

  useEffect(() => {
    const start = Date.now();
    setState([start, start]);
    const timer = setTimeout(() => {
      setState([start, Date.now()]);
      callback && callback();
    }, delayMs);
    return () => clearTimeout(timer);
  }, [delayMs, ...deps]);

  return now - start;
};
