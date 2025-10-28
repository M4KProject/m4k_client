import { fluxStored, isString, isStringValid, toError } from 'fluxio';

export const groupId$ = fluxStored<string>('groupId$', '', isString);

export const getGroupId = () => groupId$.get();

export const needGroupId = () => {
  const id = getGroupId();
  if (!isStringValid(id)) throw toError('no group id');
  return id;
};
