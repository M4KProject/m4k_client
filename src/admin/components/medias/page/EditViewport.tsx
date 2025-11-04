import { useState } from 'preact/hooks';
import { PanZoom, PanZoomController } from '@/components/medias/PanZoom';
import { Css } from 'fluxio';
import { EditViewportControls } from './EditViewportControls';

const c = Css('EditViewport', {
  '': {
    position: 'relative',
    flex: 1,
  },
  Body: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    bg: '#FF0000',
    fCol: 1,
  },
  'Body div': {},
});

export const EditViewport = () => {
  const [controller, setController] = useState<PanZoomController | undefined>(undefined);

  return (
    <div {...c()}>
      <PanZoom onNewController={setController}>
        <div {...c('Body')}>
          <div style={{ flex: 1, background: '#FF00FF' }}>#FF00FF</div>
          <div style={{ flex: 2, background: '#0000FF' }}>#0000FF</div>
          <div style={{ flex: 1, background: '#00FF00' }}>#00FF00</div>
        </div>
      </PanZoom>
      {controller && <EditViewportControls controller={controller} />}
    </div>
  );
};
