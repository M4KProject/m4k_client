import { ComponentChildren } from 'preact';
import { BFactory } from './BFactory';
import { BItem } from './bTypes';

export const bChildren = (item: BItem) => {
  // console.debug('bChildren', item);

  const children: ComponentChildren[] = [];
  
  if (item.children) {
    for (const c of item.children) {
      children.push(<BFactory key={c} i={c} />);
    }
  }

  return children;
};
  