import { B } from '../B';

export const addIn = (b: B) => {
  console.debug('addIn');
  const children = [...(b.d.children || [])];
  children.push({});
  b.update({ children });
  return b.children[b.children.length - 1];
};
