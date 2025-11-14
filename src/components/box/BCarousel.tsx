import { BComp } from './bTypes';

export const BCarousel: BComp = ({ i, item, props, ctrl }) => {
  console.debug('BCarousel', i, item, props, ctrl);

  return <div {...props} />;
};
