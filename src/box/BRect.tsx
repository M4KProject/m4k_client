import { BComp } from './bTypes';
import { bChildren } from './bChildren';

export const BRect: BComp = ({ i, item, props, ctrl }) => {
  // console.debug('BRect', i, item, props, ctrl);

  return <div {...props}>{bChildren(item)}</div>;
};
