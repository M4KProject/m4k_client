import { Dictionary, FluxDictionary } from 'fluxio';

export const selectedById$ = new FluxDictionary<boolean>({});

export const updateSelected = (changes: Dictionary<boolean>) => selectedById$.update(changes);
