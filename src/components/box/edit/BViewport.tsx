import { PanZoom } from '@/components/common/PanZoom';
import { Css, onHtmlEvent } from 'fluxio';
import { BButtons, SCREEN_SIZES } from './BButtons';
import { BHandles } from './BHandles';
import { BFactory } from '@/components/box/BFactory';
import { useEffect } from 'preact/hooks';
import { useBEditController } from './useBEditController';

const c = Css('BViewport', {
  '': {
    position: 'relative',
    flex: 1,
    bg: 'bg0',
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
    const ready = () => {
      console.debug('BViewport ready');
      const pz = controller?.panZoom;
      if (!pz) return;

      const el = pz.viewport();
      onHtmlEvent(el, 'click', (event) => {
        controller?.click$.set({ el, event });
      });

      const [w, h] = SCREEN_SIZES[0]!;
      pz.setSize(w, h);

      setTimeout(() => pz.fitToContainer(), 100);
      setTimeout(() => pz.fitToContainer(), 1000);
    };
    ready();

    return controller?.panZoom.ready$.on(ready);
  }, [controller]);

  return (
    <div {...c('')}>
      <PanZoom ctrl={controller?.panZoom}>
        <div {...c('Body')}>
          <BFactory i={0} />
        </div>
      </PanZoom>
      <BButtons />
      <BHandles />
    </div>
  );
};
