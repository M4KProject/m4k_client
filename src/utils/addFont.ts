import { addCssFile } from 'fluxio';

export const addFont = (name: string) => addCssFile(`https://fonts.m4k.fr/v1/${name}`);
