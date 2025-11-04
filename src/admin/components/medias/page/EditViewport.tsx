import { PanZoom } from '@/components/medias/PanZoom';
import { Css } from 'fluxio';
import { EditViewportControls } from './EditViewportControls';
import { Box } from './box/Box';
import { EditSelect } from './EditSelect';
import { useBoxController } from './box/BoxController';

const c = Css('EditViewport', {
  '': {
    position: 'relative',
    flex: 1,
  },
  Body: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    bg: 'b0',
    fCol: 1,
  },
  'Body div': {},
});

export const EditViewport = () => {
  const ctrl = useBoxController();

  return (
    <div {...c()}>
      <PanZoom
        onNewController={(panZoomCtrl) => {
          ctrl.panZoom$.set(panZoomCtrl);
        }}
      >
        <div {...c('Body')}>
          <Box id="root" />
        </div>
      </PanZoom>
      <EditViewportControls />
      <EditSelect />
    </div>
  );
};
