import { PanZoom } from '@/components/PanZoom';
import { Css, onHtmlEvent } from 'fluxio';
import { BButtons, SCREEN_SIZES } from './BButtons';
import { BHandles } from './BHandles';
import { useBCtrl } from '@/components/box/BCtrl';
import { BFactory } from '@/components/box/BFactory';
import { useEffect } from 'preact/hooks';

const c = Css('BViewport', {
  '': {
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
  const ctrl = useBCtrl();

  useEffect(() => {
    return ctrl.panZoom.ready$.on(() => {
      const el = ctrl.panZoom.viewport();
      onHtmlEvent(el, 'click', (event) => {
        ctrl.click$.set({ el, event });
      });

      const [w, h] = SCREEN_SIZES[0]!;
      ctrl.panZoom.setSize(w, h);
    });
  }, [ctrl]);

  return (
    <div {...c()}>
      <PanZoom ctrl={ctrl.panZoom}>
        <div {...c('Body')}>
          <BFactory i={0} />
        </div>
      </PanZoom>
      <BButtons />
      <BHandles />
    </div>
  );
};
