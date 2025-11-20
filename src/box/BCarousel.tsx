import { Css } from 'fluxio';
import { BComp } from './bTypes';

const c = Css('BCarousel', {});

export const BCarousel: BComp = ({ i, item, props, ctrl }) => {
  console.debug('BCarousel', i, item, props, ctrl);

  return <div {...props} {...c(props, '')} />;
};
