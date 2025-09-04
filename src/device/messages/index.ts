import { newMsg } from "@common/helpers/Msg";

export * from "./dialog$";
export * from "./page$";
export * from "./playlist$";
export * from "./contentRotation$";

export const codePin$ = newMsg('yoyo', 'codePin', true);
export const copyDir$ = newMsg('', 'copyDir', true);
export const itemDurationMs$ = newMsg(5000, 'itemDurationMs', true);
export const itemFit$ = newMsg('', 'itemFit', true);
export const itemAnim$ = newMsg('', 'itemAnim', true);
export const hasVideoMuted$ = newMsg(true, 'hasVideoMuted', true);
export const url$ = newMsg('', 'url', true);
export const offlineMode$ = newMsg(false, 'offlineMode', true);