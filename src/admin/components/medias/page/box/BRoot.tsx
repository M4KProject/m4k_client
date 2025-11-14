import { bChildren } from './bChildren';
import { BComp } from './bTypes';

export const BRoot: BComp = ({ i, item, props, ctrl }) => {
  // console.debug('BRoot', i, item, props, ctrl);

  return <div {...props}>{bChildren(item)}</div>;
};
