import { clipboardPaste } from '@common/ui';
import { B } from '../B';
import { DRoot } from '../D';
import { addIn } from './addIn';
import { importData } from './importData';

export const pasteIn = async (bParent: B) => {
  const d = await clipboardPaste();
  console.debug('pasteIn', d);
  if (!d) return;
  const b = addIn(bParent);
  if (!b) return;
  importData(b, d as DRoot);
  return b;
};
