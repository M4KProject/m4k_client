import { B } from '../B';

export const selectUp = (): void => {
  const parent = B.select$.v?.parent;
  if (parent) B.select$.set(parent);
};
