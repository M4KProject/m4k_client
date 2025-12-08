import { Css } from 'fluxio';
import { BComp } from './bTypes';
import { createElement } from 'preact';

const c = Css('BWeb', {
  '': {
    position: 'relative',
    display: 'inline-block',
    m: '1%',
    p: '1%',
  },
});

export const BWeb: BComp = ({ item, props }) => {
  console.debug('BWeb', props);
  return createElement('div', { ...props, ...c(props, '') });
};
