import { Css } from 'fluxio';
import { BHierarchies } from './BHierarchies';
import { BProps } from './BProps';
import { useBEditController } from './useBEditController';
import { useFlux } from '@/hooks/useFlux';
import { isAnimStateOpen, useAnimState } from '@/hooks/useAnimState';

const c = Css('BSide', {
  '': {
    position: 'relative',
    transition: 0.4,
    w: 0,
    h: '100%',
  },
  '-open': {
    w: 300,
  },
  Content: {
    position: 'absolute',
    elevation: 2,
    w: 300,
    h: '100%',
    bg: 'bg',
    overflowX: 'hidden',
    overflowY: 'auto',
    col: 1,
    transition: 0.4,
    translateX: '-100%',
    zIndex: 10,
  },
  '-open &Content': {
    translateX: '0%',
  },
});

export const BSide = () => {
  const controller = useBEditController();
  const page = useFlux(controller?.page$);
  const animState = useAnimState(!!page, 400);
  const unmounted = animState === 'unmounted';

  if (unmounted) return null;

  return (
    <div {...c('', isAnimStateOpen(animState) && `-open`)}>
      <div {...c('Content')}>
        {page === 'hierarchy' && (
          <BHierarchies />
        )}
        <BProps />
      </div>
    </div>
  );
};
