import { Dict, Msg } from '@common/utils';

export * from './adminPage$';
export * from './device$';
export * from './group$';
export * from './isAdmin$';
export * from './isAdvanced$';
export * from './search$';

export const selectedById$ = new Msg<Dict<boolean>>({});
