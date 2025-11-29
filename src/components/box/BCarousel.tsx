import { Css } from 'fluxio';
import { BComp } from './bTypes';

const c = Css('BCarousel', {
  '': { wh: '100%' },
});

export const BCarousel: BComp = ({ i, item, props }) => {
  console.debug('BCarousel', i, item, props);

  return <div {...props} {...c(props, '')} />;
};
