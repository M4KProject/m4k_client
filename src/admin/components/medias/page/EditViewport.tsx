import { PanZoom } from '@/components/medias/PanZoom';
import { Css, flux } from 'fluxio';

const c = Css('EditViewport', {
  '': {
    position: 'relative',
    flex: 1,
  },
});

export const viewport$ = flux({
  scale: 1,
  w: 960,
  h: 1280,
  x: 0,
  y: 0,
  panel: '',
});

export const EditViewport = () => {
  return <PanZoom {...c()}>Viewport</PanZoom>;
};
