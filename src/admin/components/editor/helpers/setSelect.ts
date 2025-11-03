import { B } from '../B';

export const setSelect = (b?: B | null) => {
  if (!b) return;
  B.select$.set(b);
};
