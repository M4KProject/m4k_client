import { Css } from 'fluxio';
import { BComp } from './bTypes';

const c = Css('BPlayer', {
  '': { wh: '100%' },
});

export const BPlayer: BComp = ({ i, item, props }) => {
  console.debug('BPlayer', i, item, props);

  return <div {...props} {...c(props, '')} />;
};
