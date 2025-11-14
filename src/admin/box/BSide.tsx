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
    p: 4,
    wh: '100%',
    bg: 'bg',
    overflowX: 'hidden',
    overflowY: 'auto',
    col: ['stretch', 'start'],
  }
});

export const BSide = () => {
  return (
    <div {...c()}>
      <BHierarchies />
      <BProps />
    </div>
  );
};
