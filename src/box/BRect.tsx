import { BComp } from './bTypes';
import { bChildren } from './bChildren';
import { Css } from 'fluxio';

const c = Css('BRect', {
  '': {
    position: 'absolute',
  },
});

export const BRect: BComp = ({ item, props }) => {
  return <div {...props} {...c(props, '')}>{bChildren(item)}</div>;
};
