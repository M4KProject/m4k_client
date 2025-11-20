import { Css, isItem, isUInt, normalizeIndex, randColor } from 'fluxio';
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
  ClipboardCopy,
  ClipboardPaste,
  ClipboardX,
  Save,
} from 'lucide-react';
import { useState } from 'preact/hooks';
import { BCtrl, useBCtrl } from '@/box/BCtrl';
import { Button, ButtonProps } from '@/components/Button';
import { useFlux } from '@/hooks/useFlux';
import { clipboardCopy, clipboardPaste } from '@/utils/clipboard';
import { BData } from '@/box/bTypes';

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

const addRect = (ctrl: BCtrl) => ctrl.add({ a: [25, 25, 50, 50], s: { bg: randColor() } });

const cut = async (ctrl: BCtrl, index: number) => {
  const data = ctrl.getData(index);
  await clipboardCopy(data);
  ctrl.delete(index);
};

const copy = async (ctrl: BCtrl, index: number) => {
  const data = ctrl.getData(index);
  await clipboardCopy(data);
};

const paste = async (ctrl: BCtrl, index: number) => {
  const item = ctrl.get(index);
  if (!item) return;
  const d: BData = await clipboardPaste();
  if (isItem(d)) {
    ctrl.add({ ...d, p: item.t === d.t ? item.p : index });
  }
};

export const BButtons = () => {
  const ctrl = useBCtrl();
  const select = useFlux(ctrl.select$);
  const selectIndex = select.i;
  const pz = ctrl.panZoom;
  const [sizeIndex, setSizeIndex] = useState(0);
  const [sizeWidth, sizeHeight, sizeTitle, SizeIcon] = SCREEN_SIZES[sizeIndex]!;

  const toggleScreenSize = () => {
    const nextIndex = normalizeIndex(sizeIndex + 1, SCREEN_SIZES.length);
    setSizeIndex(nextIndex);
    const [w, h] = SCREEN_SIZES[nextIndex]!;
    ctrl.panZoom.setSize(w, h);
  };

  if (!isUInt(selectIndex)) {
    return (
      <div {...c()}>
        <BButton
          icon={<SizeIcon />}
          onClick={toggleScreenSize}
          tooltip={`${sizeTitle} (${sizeWidth}x${sizeHeight})`}
        />
        <BButton icon={<RotateCw />} onClick={() => pz.switchSize()} tooltip="Tourner l'écran" />
        <div {...c('Sep')} />
        <BButton icon={<ZoomIn />} onClick={() => pz.zoomIn()} tooltip="Zoom +" />
        <BButton icon={<ZoomOut />} onClick={() => pz.zoomOut()} tooltip="Zoom -" />
        <BButton
          icon={<Maximize2 />}
          onClick={() => pz.fitToContainer()}
          tooltip="Ajuster au conteneur"
        />
        <div {...c('Sep')} />
        <BButton
          icon={<SquarePlus />}
          onClick={() => addRect(ctrl)}
          tooltip="Ajouter un rectangle"
        />
        <div {...c('Sep')} />
        <BButton icon={<Save />} onClick={() => {}} tooltip="Enregistrer" />
      </div>
    );
  } else {
    return (
      <div {...c()}>
        <BButton icon={<ClipboardX />} onClick={() => cut(ctrl, selectIndex)} tooltip="Couper" />
        <BButton
          icon={<ClipboardCopy />}
          onClick={() => copy(ctrl, selectIndex)}
          tooltip="Copier"
        />
        <BButton
          icon={<ClipboardPaste />}
          onClick={() => paste(ctrl, selectIndex)}
          tooltip="Coller"
        />
      </div>
    );
  }
};
