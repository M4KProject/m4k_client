import { BComp } from './bTypes';
import { bChildren } from './bChildren';
import { Css } from 'fluxio';

const c = Css('BZone', {
  '': {
    position: 'absolute',
  },
});

export const BZone: BComp = ({ item, props }) => {
  return (
    <div {...props} {...c(props, '')}>
      {bChildren(item)}
    </div>
  );
};
