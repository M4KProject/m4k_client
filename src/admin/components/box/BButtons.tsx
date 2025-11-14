import { Css, normalizeIndex, randColor } from 'fluxio';
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
  SquarePlus,
} from 'lucide-react';
import { useState } from 'preact/hooks';
import { useBCtrl } from '@/components/box/BCtrl';
import { Button, ButtonProps } from '@/components/Button';

const c = Css('BButtons', {
  '': {
    position: 'absolute',
    b: 8,
    r: '50%',
    row: 'center',
    zIndex: 20,
    translateX: '50%',
    // bg: 'bg',
    // elevation: 1,
    // rounded: 5,
  },
  Sep: {
    w: 16,
  },
  Button: {
    bg: 'bg',
    elevation: 1,
  }
});

type ScreenSize = [number, number, string, typeof Monitor];

export const SCREEN_SIZES: ScreenSize[] = [
  [1280, 720, 'Monitor HD', MonitorSmartphone],
  [1920, 1080, 'Monitor FHD', Monitor],
  [3840, 2160, 'Monitor 4K', Tv],
  [1024, 768, 'Tablet', Tablet],
  [360, 640, 'Smartphone', Smartphone],
];

const BButton = (props: ButtonProps) => (
  <Button {...c('Button')} color="primary" {...props} />
)

export const BButtons = () => {
  const ctrl = useBCtrl();
  const panZoom = ctrl.panZoom;
  const [sizeIndex, setSizeIndex] = useState(0);
  const [sizeWidth, sizeHeight, sizeTitle, SizeIcon] = SCREEN_SIZES[sizeIndex]!;

  const toggleScreenSize = () => {
    const nextIndex = normalizeIndex(sizeIndex + 1, SCREEN_SIZES.length);
    setSizeIndex(nextIndex);
    const [w, h] = SCREEN_SIZES[nextIndex]!;
    ctrl.panZoom.setSize(w, h);
  };

  return (
    <div {...c()}>
      <BButton
        icon={<SizeIcon />}
        onClick={toggleScreenSize}
        tooltip={`${sizeTitle} (${sizeWidth}x${sizeHeight})`}
      />
      <BButton
        icon={<RotateCw />}
        onClick={() => {
          const [w, h] = panZoom.getSize();
          panZoom.setSize(h, w);
        }}
        tooltip="Tourner l'écran"
      />
      <div {...c('Sep')} />
      <BButton
        icon={<ZoomIn />}
        onClick={() => panZoom.zoomIn()}
        tooltip="Zoom +"
      />
      <BButton
        icon={<ZoomOut />}
        onClick={() => panZoom.zoomOut()}
        tooltip="Zoom -"
      />
      <BButton
        icon={<Maximize2 />}
        onClick={() => panZoom.fitToContainer()}
        tooltip="Ajuster au conteneur"
      />
      <div {...c('Sep')} />
      <BButton
        icon={<SquarePlus />}
        onClick={() => ctrl.add({
          type: 'rect',
          pos: [25, 25, 50, 50],
          style: {
            bg: randColor(),
          },
        })}
        tooltip="Ajouter un rectangle"
      />
    </div>
  );
};
