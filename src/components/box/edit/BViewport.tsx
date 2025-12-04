import { PanZoom } from '@/components/common/PanZoom';
import { Css } from 'fluxio';
import { BHandles } from './BHandles';
import { BFactory } from '@/components/box/BFactory';
import { useEffect } from 'preact/hooks';
import { useBEditController } from './useBEditController';
import { BTimeline } from './BTimeline';
import { BSide } from './BSide';

const c = Css('BViewport', {
  '': {
    position: 'relative',
    flex: 1,
    row: 1,
  },
  Left: {
    position: 'relative',
    flex: 1,
    bg: 'bg0',
    col: 1,
    h: '100%',
  },
  PanZoom: {
    position: 'relative',
    flex: 1,
  },
  Body: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    bg: 'bg',
    col: 1,
  },
});

export const BViewport = () => {
  const controller = useBEditController();

  useEffect(() => controller?.bindKeyDown(), [controller]);

  useEffect(() => {
    controller?.ready();
    return controller?.panZoom.ready$.on(controller.ready);
  }, [controller]);

  if (!controller) return null;

  return (
    <div {...c('')}>
      <BSide />
      <div {...c('Left')}>
        <PanZoom {...c('PanZoom')} controller={controller?.panZoom}>
          <div {...c('Body')}>
            <BFactory i={0} />
          </div>
        </PanZoom>
        <BHandles />
        <BTimeline />
      </div>
    </div>
  );
};
