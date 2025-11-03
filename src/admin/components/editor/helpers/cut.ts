import { clipboardCopy } from '@common/ui';
import { B } from '../B';
import { exportData } from './exportData';
import { remove } from './remove';

export const cut = (b: B) => {
  console.debug('cut');
  clipboardCopy(exportData(b));
  return remove(b);
};
