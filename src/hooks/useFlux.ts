import { Flux, FluxDictionary } from 'fluxio';
import { useEffect, useState } from 'preact/hooks';

type NFlux<T> = Flux<T> | null | undefined;
type NFluxDictionary<T> = FluxDictionary<T> | null | undefined;

interface UseFlux {
  <T = any>(msg: Flux<T>): T;
  <T = any>(msg: NFlux<T>): T | undefined;
}

interface UseFluxState {
  <T = any>(msg: Flux<T>): [T, (next: T) => void];
  <T = any>(msg: NFlux<T>): [T | undefined, (next: T) => void];
}

export const useFlux = (<T = any>(msg: NFlux<T> | null | undefined): T | undefined => {
  const [state, setState] = useState(msg ? msg.get() : undefined);
  useEffect(() => {
    if (!msg) {
      setState(undefined);
      return;
    }
    setState(msg.get());
    return msg.on((v) => setState(v));
  }, [msg]);
  return state;
}) as UseFlux;

export const useFluxState = (<T = any>(msg: Flux<T>): [T, (next: T) => void] => {
  const [state, setState] = useState(msg && msg.get());
  useEffect(() => {
    setState(msg && msg.get());
    return msg && msg.on(setState);
  }, [msg]);
  return [state, (next) => msg && msg.set(next)];
}) as UseFluxState;

export const useFluxItem = <T = any>(
  msg: NFluxDictionary<T>,
  key: string
): [T | undefined, (next: T) => void] => {
  const [state, setState] = useState(msg ? msg.getItem(key) : undefined);
  useEffect(() => {
    setState(msg ? msg.getItem(key) : undefined);
    if (msg) {
      return msg.on(() => {
        setState(msg && msg.getItem(key));
      });
    }
    return;
  }, [msg, key]);
  return [state, (next) => msg && msg.setItem(key, next)];
};
