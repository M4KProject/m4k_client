import { PanZoomController } from '@/components/medias/PanZoom';
import { Css, normalizeIndex } from 'fluxio';
import { Button, tooltip } from '@common/components';
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
import { useEffect, useState } from 'preact/hooks';

const c = Css('EditViewportControls', {
  '': {
    position: 'absolute',
    b: 1,
    r: 1,
    fRow: 'center',
    bg: 'b0',
    elevation: 1,
    zIndex: 20,
    rounded: 2,
  },
});

type ScreenSize = [number, number, string, typeof Monitor];

const SIZES: ScreenSize[] = [
  [1280, 720, 'Monitor HD', MonitorSmartphone],
  [1920, 1080, 'Monitor FHD', Monitor],
  [3840, 2160, 'Monitor 4K', Tv],
  [1024, 768, 'Tablet', Tablet],
  [360, 640, 'Smartphone', Smartphone],
];

interface EditViewportControlsProps {
  controller: PanZoomController;
}

interface ScreenSizeButtonProps {
  controller: PanZoomController;
}

const ScreenSizeButton = ({ controller }: ScreenSizeButtonProps) => {
  const [index, setIndex] = useState(0);
  const [w, h, title, Icon] = SIZES[index]!;

  useEffect(() => controller.setSize(w, h), [controller]);

  const toggleScreenSize = () => {
    const nextIndex = normalizeIndex(index + 1, SIZES.length);
    setIndex(nextIndex);
    const [w, h] = SIZES[nextIndex]!;
    controller.setSize(w, h);
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

export const EditViewportControls = ({ controller }: EditViewportControlsProps) => (
  <div {...c()}>
    <ScreenSizeButton controller={controller} />
    <Button
      icon={<RotateCw />}
      color="primary"
      onClick={() => {
        const [w, h] = controller.getSize();
        controller.setSize(h, w);
      }}
      {...tooltip("Tourner l'écran")}
    />
    <Button
      icon={<ZoomIn />}
      color="primary"
      onClick={() => controller?.zoomIn()}
      {...tooltip('Zoom +')}
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
);
