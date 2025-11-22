import { Css } from 'fluxio';
import { BHierarchies } from './BHierarchies';
import { BProps } from './BProps';

const c = Css('BSide', {
  '': {
    position: 'relative',
    elevation: 2,
    w: 300,
    h: '100%',
    zIndex: 10,
  },
  Content: {
    position: 'absolute',
    wh: '100%',
    bg: 'bg',
    overflowX: 'hidden',
    overflowY: 'auto',
    col: 1,
  },
});

export const BSide = () => {
  return (
    <div {...c()}>
      <div {...c('Content')}>
        <BHierarchies />
        <BProps />
      </div>
    </div>
  );
};
