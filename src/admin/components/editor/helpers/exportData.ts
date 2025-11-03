import { deepClone } from 'fluxio';
import { B } from '../B';
import { cleanD } from './cleanD';

export const exportData = (b: B) => {
  console.debug('exportData');
  const d = deepClone(b.d);
  cleanD(d);
  return d;
};
