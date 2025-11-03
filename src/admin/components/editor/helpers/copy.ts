import { clipboardCopy } from '@common/ui';
import { B } from '../B';
import { exportData } from './exportData';

export const copy = (b: B) => {
  console.debug('copy');
  clipboardCopy(exportData(b));
  return b;
};
