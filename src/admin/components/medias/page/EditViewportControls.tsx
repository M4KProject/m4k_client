import { Css, normalizeIndex } from 'fluxio';
import {
  RotateCw,
  Monitor,
  Tablet,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Smartphone,
  Tv,
  MonitorSmartphone,
} from 'lucide-react';
import { useState } from 'preact/hooks';
import { useBoxCtrl } from './box/BoxCtrl';
import { Button } from '@/components/Button';
import { tooltip } from '@/components/Tooltip';

const c = Css('EditViewportControls', {
  '': {
    position: 'absolute',
    b: 8,
    r: '50%',
    row: 'center',
    bg: 'bg',
    elevation: 1,
    zIndex: 20,
    rounded: 5,
    translateX: '50%',
  },
});

type ScreenSize = [number, number, string, typeof Monitor];

export const SCREEN_SIZES: ScreenSize[] = [
  [1280, 720, 'Monitor HD', MonitorSmartphone],
  [1920, 1080, 'Monitor FHD', Monitor],
  [3840, 2160, 'Monitor 4K', Tv],
  [1024, 768, 'Tablet', Tablet],
  [360, 640, 'Smartphone', Smartphone],
];

const ScreenSizeButton = () => {
  const ctrl = useBoxCtrl();
  const [index, setIndex] = useState(0);
  const [w, h, title, Icon] = SCREEN_SIZES[index]!;

  const toggleScreenSize = () => {
    const nextIndex = normalizeIndex(index + 1, SCREEN_SIZES.length);
    setIndex(nextIndex);
    const [w, h] = SCREEN_SIZES[nextIndex]!;
    ctrl.panZoom.setSize(w, h);
  };

  return (
    <Button
      icon={<Icon />}
      color="primary"
      onClick={toggleScreenSize}
      {...tooltip(`${title} (${w}x${h})`)}
    />
  );
};

export const EditViewportControls = () => {
  const ctrl = useBoxCtrl();
  const panZoom = ctrl.panZoom;
  return (
    <div {...c()}>
      <ScreenSizeButton />
      <Button
        icon={<RotateCw />}
        color="primary"
        onClick={() => {
          const [w, h] = panZoom.getSize();
          panZoom.setSize(h, w);
        }}
        {...tooltip("Tourner l'écran")}
      />
      <Button
        icon={<ZoomIn />}
        color="primary"
        onClick={() => panZoom.zoomIn()}
        {...tooltip('Zoom +')}
      />
      <Button
        icon={<ZoomOut />}
        color="primary"
        onClick={() => panZoom.zoomOut()}
        {...tooltip('Zoom -')}
      />
      <Button
        icon={<Maximize2 />}
        color="primary"
        onClick={() => panZoom.fitToContainer()}
        {...tooltip('Ajuster au conteneur')}
      />
    </div>
  );
};
