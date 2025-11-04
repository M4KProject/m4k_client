import { useEffect, useMemo, useState } from 'preact/hooks';
import { PanZoom, PanZoomController } from '@/components/medias/PanZoom';
import { Css } from 'fluxio';
import { EditViewportControls } from './EditViewportControls';
import { Box, BoxContext } from './box/Box';
import { BoxController } from './box/BoxController';

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
  const boxController = useMemo(() => new BoxController(), []);

  useEffect(() => {
    boxController.set('aaa', {
      pos: [10, 10, 10, 10],
      style: { bg: '#0000FF' },
    });
    boxController.set('bbb', {
      pos: [20, 10, 10, 10],
      style: { bg: '#00FF00' },
    });
    boxController.set('root', {
      children: ['aaa', 'bbb']
    });
  }, []);

  return (
    <div {...c()}>
      <PanZoom onNewController={setController}>
        <div {...c('Body')}>
          <BoxContext.Provider value={boxController}>
            <Box id="root" />
          </BoxContext.Provider>
        </div>
      </PanZoom>
      {controller && <EditViewportControls controller={controller} />}
      <EditSelect />
    </div>
  );
};
