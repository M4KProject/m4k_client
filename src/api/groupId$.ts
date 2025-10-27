import { fluxStored, isStringValid, toError } from 'fluxio';

export const groupId$ = fluxStored<string>('groupId', '', isStringValid);

export const getGroupId = () => groupId$.get();

export const needGroupId = () => {
  const id = getGroupId();
  if (!isStringValid(id)) throw toError('no group id');
  return id;
};
