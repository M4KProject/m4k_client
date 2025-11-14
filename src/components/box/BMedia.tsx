import { BComp } from './bTypes';

export const BMedia: BComp = ({ i, item, props, ctrl }) => {
  console.debug('BMedia', i, item, props, ctrl);

  return <div {...props} />;
};
