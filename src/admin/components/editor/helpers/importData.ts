import { B } from '../B';
import { DRoot } from '../D';
import { cleanD } from './cleanD';

export const importData = (b: B, d: DRoot) => {
  console.debug('importData', d);
  cleanD(d);
  if (b === B.root) {
    B.importRoot(d);
    return;
  }
  b.setData(d);
};
