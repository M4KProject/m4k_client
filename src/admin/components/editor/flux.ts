import { flux } from 'fluxio';

export const siteKey$ = flux('');
export const panel$ = flux('');
export const terminal$ = flux('');
export const css$ = flux('');
export const js$ = flux('');
export const zoom$ = flux(0);
export const screenSize$ = flux({ w: 0, h: 0 });
