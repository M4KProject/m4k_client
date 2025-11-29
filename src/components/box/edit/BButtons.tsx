import { Css, isUInt, normalizeIndex } from 'fluxio';
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
  ClipboardCopy,
  ClipboardPaste,
  ClipboardX,
  Save,
} from 'lucide-react';
import { useState } from 'preact/hooks';
import { Button, ButtonProps } from '@/components/common/Button';
import { useFlux } from '@/hooks/useFlux';
import { useBEditController } from './useBEditController';

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

const BButton = (props: ButtonProps) => <Button {...c('Button')} color="primary" {...props} />;

export const BButtons = () => {
  const controller = useBEditController();
  const select = useFlux(controller.select$);
  const selectIndex = select.i;
  const pz = controller.panZoom;
  const [sizeIndex, setSizeIndex] = useState(0);
  const [sizeWidth, sizeHeight, sizeTitle, SizeIcon] = SCREEN_SIZES[sizeIndex]!;

  const toggleScreenSize = () => {
    const nextIndex = normalizeIndex(sizeIndex + 1, SCREEN_SIZES.length);
    setSizeIndex(nextIndex);
    const [w, h] = SCREEN_SIZES[nextIndex]!;
    controller.panZoom.setSize(w, h);
  };

  const hasSelect = isUInt(selectIndex);

  return (
    <div {...c('')}>
      {!hasSelect && (
        <>
          <BButton
            icon={SizeIcon}
            onClick={toggleScreenSize}
            tooltip={`${sizeTitle} (${sizeWidth}x${sizeHeight})`}
          />
          <BButton icon={RotateCw} onClick={() => pz.switchSize()} tooltip="Tourner l'écran" />
          <div {...c('Sep')} />
          <BButton icon={ZoomIn} onClick={() => pz.zoomIn()} tooltip="Zoom +" />
          <BButton icon={ZoomOut} onClick={() => pz.zoomOut()} tooltip="Zoom -" />
          <BButton
            icon={Maximize2}
            onClick={() => pz.fitToContainer()}
            tooltip="Ajuster au conteneur"
          />
        </>
      )}
      {hasSelect && (
        <>
          <BButton icon={ClipboardX} onClick={() => controller.cut()} tooltip="Couper" />
          <BButton icon={ClipboardCopy} onClick={() => controller.copy()} tooltip="Copier" />
          <BButton icon={ClipboardPaste} onClick={() => controller.paste()} tooltip="Coller" />
        </>
      )}
      <div {...c('Sep')} />
      <BButton icon={Save} onClick={() => controller.save()} tooltip="Enregistrer" />
    </div>
  );
};
