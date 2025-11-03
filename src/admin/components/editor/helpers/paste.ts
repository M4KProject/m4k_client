import { clipboardPaste } from '@common/ui';
import { B } from '../B';
import { DRoot } from '../D';
import { add } from './add';
import { importData } from './importData';

export const paste = async (bParent: B) => {
  const d = await clipboardPaste();
  console.debug('paste', d);
  if (!d) return;
  const b = add(bParent);
  if (!b) return;
  importData(b, d as DRoot);
  return b;
};
