import { fluxStored, isBoolean } from "fluxio";

export const isDevice$ = fluxStored<boolean>('isDevice$', false, isBoolean);