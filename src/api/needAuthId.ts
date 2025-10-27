import { isStringValid, toError } from "fluxio";
import { getPbClient } from "pocketbase-lite";

export const needAuthId = () => {
  const id = getPbClient().getAuthId();
  if (!isStringValid(id)) throw toError('no group id');
  return id;
};
