import { PanZoom } from '@/components/PanZoom';
import { Css } from 'fluxio';
import { EditViewportControls } from './EditViewportControls';
import { Box } from './box/Box';
import { useBoxCtrl } from './box/BoxCtrl';
import { EditHandles } from './EditHandles';

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
  const ctrl = useBoxCtrl();
  return (
    <div {...c()}>
      <PanZoom ctrl={ctrl.panZoom}>
        <div {...c('Body')}>
          <Box id="root" />
        </div>
      </PanZoom>
      <EditViewportControls />
      <EditHandles />
    </div>
  );
};
