import { bChildren } from './bChildren';
import { BComp } from './bTypes';

export const BRoot: BComp = ({ item, props }) => {
  return <div {...props}>{bChildren(item)}</div>;
};
