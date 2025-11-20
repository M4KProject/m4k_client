import { Css } from 'fluxio';
import { bChildren } from './bChildren';
import { BComp } from './bTypes';

const c = Css('BRoot', {
  '': {
    wh: '100%',
    bg: '#FFFFFF',
  },
});

export const BRoot: BComp = ({ item, props }) => {
  return (
    <div {...props} {...c(props, '')}>
      {bChildren(item)}
    </div>
  );
};
