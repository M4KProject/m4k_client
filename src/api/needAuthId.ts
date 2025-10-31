import { isStringValid, toError } from 'fluxio';
import { getPbClient } from 'pblite';

export const needAuthId = () => {
  const id = getPbClient().getAuthId();
  if (!isStringValid(id)) throw toError('no group id');
  return id;
};
