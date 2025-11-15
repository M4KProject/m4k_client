import { ComponentChildren } from 'preact';
import { BFactory } from './BFactory';
import { BItem } from './bTypes';

export const bChildren = (item: BItem) => {
  // console.debug('bChildren', item);

  const children: ComponentChildren[] = [];
  
  if (item.r) {
    for (const c of item.r) {
      children.push(<BFactory key={c} i={c} />);
    }
  }

  return children;
};
  