import { fluxDictionary, setTemplate } from 'fluxio';
import { useFlux } from './useFlux';
import { Dictionary } from 'fluxio';

export const tr$ = fluxDictionary<string>();

export function addTr(changes: Dictionary<string>) {
  tr$.update(changes);
}

export const tr = (key: any, params?: Dictionary<string>): any => {
  const translateByKey = tr$.get();
  key = String(key);
  const translate = translateByKey[key] || key;
  return params ? setTemplate(translate, params) : translate;
};

export const useTr = () => {
  useFlux(tr$);
  return tr;
};
