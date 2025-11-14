import { PanZoom } from '@/components/PanZoom';
import { Css } from 'fluxio';
import { EditButtons } from './EditButtons';
import { useBCtrl } from './box/BCtrl';
import { EditHandles } from './EditHandles';
import { BFactory } from './box/BFactory';

const c = Css('EditViewport', {
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

export const EditViewport = () => {
  const ctrl = useBCtrl();
  return (
    <div {...c()}>
      <PanZoom ctrl={ctrl.panZoom}>
        <div {...c('Body')}>
          <BFactory i={0} />
        </div>
      </PanZoom>
      <EditButtons />
      <EditHandles />
    </div>
  );
};
