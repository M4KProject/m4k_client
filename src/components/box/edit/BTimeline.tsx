import { Css, isUInt } from 'fluxio';
import {
  Maximize2Icon,
  ZoomInIcon,
  ZoomOutIcon,
  ClipboardCopyIcon,
  ClipboardPasteIcon,
  ClipboardXIcon,
  SaveIcon,
} from 'lucide-react';
import { Button, ButtonProps } from '@/components/common/Button';
import { useFlux } from '@/hooks/useFlux';
import { useBEditController } from './useBEditController';

const c = Css('BTimeline', {
  '': {
    h: 80,
    bg: 'bg',
    elevation: 1,
    row: ['center', 'center'],
    zIndex: 10,
  },
  Sep: {
    w: 16,
  },
  Button: {
    bg: 'bg',
    elevation: 1,
  },
});

const BTimelineButton = (props: ButtonProps) => (
  <Button color="primary" {...props} {...c('Button', props)} />
);

export const BTimeline = () => {
  const controller = useBEditController();
  const select = useFlux(controller.select$);
  const selectIndex = select?.i;
  const pz = controller.panZoom;
  const hasSelect = isUInt(selectIndex);

  if (!pz) return null;

  return (
    <div {...c('')}>
      {!hasSelect && (
        <>
          <BTimelineButton icon={ZoomInIcon} onClick={() => pz.zoomIn()} tooltip="Zoom +" />
          <BTimelineButton icon={ZoomOutIcon} onClick={() => pz.zoomOut()} tooltip="Zoom -" />
          <BTimelineButton
            icon={Maximize2Icon}
            onClick={() => pz.fitToContainer()}
            tooltip="Ajuster au conteneur"
          />
        </>
      )}
      {hasSelect && (
        <>
          <BTimelineButton icon={ClipboardXIcon} onClick={() => controller.cut()} tooltip="Couper" />
          <BTimelineButton
            icon={ClipboardCopyIcon}
            onClick={() => controller.copy()}
            tooltip="Copier"
          />
          <BTimelineButton
            icon={ClipboardPasteIcon}
            onClick={() => controller.paste()}
            tooltip="Coller"
          />
        </>
      )}
      <div {...c('Sep')} />
      <BTimelineButton icon={SaveIcon} onClick={controller.onSave} tooltip="Enregistrer" />
    </div>
  );
};
