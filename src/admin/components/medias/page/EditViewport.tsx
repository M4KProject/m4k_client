import { PanZoom, PanZoomController } from '@/components/medias/PanZoom';
import { Css, flux } from 'fluxio';
import { useFlux } from '@common/hooks';
import { Button, tooltip } from '@common/components';
import { RotateCw, Monitor, Tablet, Maximize2, ZoomIn, ZoomOut, Minimize2 } from 'lucide-react';

const c = Css('EditViewport', {
  '': {
    position: 'relative',
    flex: 1,
  },
  'Body': {
    bg: '#FF0000',
    fCol: 1,
  },
  'Body div': {
    
  },
  'Controls': {
    position: 'absolute',
    b: 1,
    r: 1,
    fRow: 'center',
  }
});

type ScreenSize = '1920x1080' | '1280x960';

const controller$ = flux<PanZoomController | undefined>(undefined);
const screenSize$ = flux<ScreenSize>('1920x1080');
const isRotated$ = flux(false);

export const EditViewport = () => {
  const controller = useFlux(controller$);
  const screenSize = useFlux(screenSize$);
  const isRotated = useFlux(isRotated$);

  const [width, height] = screenSize.split('x').map(Number);
  const finalWidth = isRotated ? height : width;
  const finalHeight = isRotated ? width : height;

  const toggleRotation = () => {
    isRotated$.set(!isRotated);
  };

  const toggleScreenSize = () => {
    screenSize$.set(screenSize === '1920x1080' ? '1280x960' : '1920x1080');
  };

  return (
    <div {...c()}>
      <PanZoom onNewController={ctrl => controller$.set(ctrl)}>
        <div {...c('Body')} style={{ width: finalWidth, height: finalHeight }}>
          <div style={{ flex: 1, background: '#FF00FF' }}>
            #FF00FF
          </div>
          <div style={{ flex: 2, background: '#0000FF' }}>
            #0000FF
          </div>
          <div style={{ flex: 1, background: '#00FF00' }}>
            #00FF00
          </div>
        </div>
      </PanZoom>
      <div {...c('Controls')}>
        <Button
          icon={<RotateCw />}
          color="primary"
          onClick={toggleRotation}
          {...tooltip('Tourner l\'écran')}
        />
        <Button
          icon={screenSize === '1920x1080' ? <Monitor /> : <Tablet />}
          color="primary"
          onClick={toggleScreenSize}
          {...tooltip(screenSize)}
        />
        <Button
          icon={<ZoomIn />}
          color="primary"
          onClick={() => controller?.zoomIn()}
          {...tooltip('Zoom +')}
        />
        <Button
          icon={<Minimize2 />}
          color="primary"
          onClick={() => controller?.resetZoom()}
          {...tooltip('Zoom 100%')}
        />
        <Button
          icon={<ZoomOut />}
          color="primary"
          onClick={() => controller?.zoomOut()}
          {...tooltip('Zoom -')}
        />
        <Button
          icon={<Maximize2 />}
          color="primary"
          onClick={() => controller?.fitToContainer()}
          {...tooltip('Ajuster au conteneur')}
        />
      </div>
    </div>
  );
};
