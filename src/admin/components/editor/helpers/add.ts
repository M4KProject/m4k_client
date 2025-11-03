import { B } from '../B';

export const add = (b: B) => {
  console.debug('add');
  if (!b.parent) return;
  const parentChildren = [...(b.parent.d.children || [])];
  const index = parentChildren.indexOf(b.d);
  if (index === -1) return;
  parentChildren.splice(index + 1, 0, {});
  b.parent.update({ children: parentChildren });
  return b.parent.children[index + 1];
};
