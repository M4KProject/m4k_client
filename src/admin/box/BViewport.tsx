import { PanZoom } from '@/components/PanZoom';
import { Css, onHtmlEvent } from 'fluxio';
import { BButtons, SCREEN_SIZES } from './BButtons';
import { BHandles } from './BHandles';
import { useBCtrl } from '@/box/BCtrl';
import { BFactory } from '@/box/BFactory';
import { useEffect } from 'preact/hooks';

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
  const ctrl = useBCtrl();

  useEffect(() => {
    console.debug('BViewport useEffect');

    const ready = () => {
      console.debug('BViewport ready');
      const pz = ctrl.panZoom;

      const el = pz.viewport();
      onHtmlEvent(el, 'click', (event) => {
        ctrl.select$.set({ el, event });
      });

      const [w, h] = SCREEN_SIZES[0]!;
      pz.setSize(w, h);

      setTimeout(() => {
        pz.fitToContainer();
      }, 1000);
    };
    ready();

    return ctrl.panZoom.ready$.on(ready);
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
