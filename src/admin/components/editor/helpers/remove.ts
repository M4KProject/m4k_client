import { B } from '../B';

export const remove = (b: B) => {
  console.debug('remove', b);
  if (!b.parent) return;
  const parentChildren = [...(b.parent.d.children || [])];
  const index = parentChildren.indexOf(b.d);
  if (index === -1) return;
  parentChildren.splice(index, 1);
  b.parent.update({ children: parentChildren });
  return b.parent;
};
