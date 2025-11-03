import { B } from '../B';
import { D } from '../D';

export const rmProp = (b: B, prop: keyof D) => {
  delete b.d[prop];
  b.setData(b.d);
};
