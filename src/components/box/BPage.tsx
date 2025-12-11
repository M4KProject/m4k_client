import { BComp } from './bTypes';
import { bChildren } from './bChildren';
import { Css } from 'fluxio';

const c = Css('BPage', {
  '': {
    position: 'absolute',
    inset: 0,
  },
});

export const BPage: BComp = ({ item, props }) => (
  <div {...props} {...c(props, '')}>
    {bChildren(item)}
  </div>
);