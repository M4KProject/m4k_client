import { Dictionary, fluxDictionary } from 'fluxio';

export const selectedById$ = fluxDictionary<boolean>();

export const updateSelected = (changes: Dictionary<boolean>) => selectedById$.update(changes);
