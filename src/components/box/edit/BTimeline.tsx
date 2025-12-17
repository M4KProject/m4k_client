import { Css, isUInt } from 'fluxio';
import {
  Maximize2Icon,
  ZoomInIcon,
  ZoomOutIcon,
  ClipboardCopyIcon,
  ClipboardPasteIcon,
  ClipboardXIcon,
  SaveIcon,
  PlusIcon,
  ArrowLeftIcon,
  UndoIcon,
  RedoIcon,
  DeleteIcon,
} from 'lucide-react';
import { Button, ButtonProps } from '@/components/common/Button';
import { useFlux, useFluxMemo } from '@/hooks/useFlux';
import { useBEditController } from './useBEditController';
import { BItem } from '../bTypes';
import { fluxUndefined } from 'fluxio/flux/fluxUndefined';
import { useMediaController } from '@/hooks/useMediaController';
import { MediaView } from '@/components/medias/MediaView';
import { MediaPreview } from '@/components/medias/MediaPreview';

const c = Css('BTimeline', {
  '': {
    bg: 'bg',
    elevation: 1,
    row: ['center', 'center'],
    zIndex: 10,
    p: 4,
  },
  Sep: {
    flex: 1,
  },
  Button: {
    m: 2,
    bg: 'bg',
    elevation: 1,
    center: 1,
  },
  'Button svg': { wh: 30 },
  Media: {
    wh: 80,
    m: 2,
    bg: 'bg',
    elevation: 1,
    center: 1,
  },
  'Media svg': { wh: 60 },
});

const BTimelineButton = (props: ButtonProps) => <Button {...props} {...c('Button', props)} />;

const BTimelineMedia = ({ box, ...props }: { box?: BItem } & ButtonProps) => {
  const mediaController = useMediaController();
  const mediaById = useFlux(mediaController.mediaById$);
  const media = mediaById[box?.m || ''];

  if (media) {
    <Button {...props} {...c('Media', props)}>
      <MediaPreview media={media} />
    </Button>;
  }

  return <Button {...props} {...c('Media', props)} />;
};

export const BTimeline = () => {
  const controller = useBEditController();
  const select = useFlux(controller.select$);
  const player = useFlux(controller.player$);
  const playerChildren = useFlux(controller.playerChildren$);
  const selectIndex = select?.i;
  const pz = controller.panZoom;
  const hasSelect = isUInt(selectIndex);

  if (!pz) return null;

  return (
    <div {...c('')}>
      <BTimelineButton icon={ZoomInIcon} onClick={() => pz.zoomIn()} tooltip="Zoom +" />
      <BTimelineButton icon={ZoomOutIcon} onClick={() => pz.zoomOut()} tooltip="Zoom -" />
      <BTimelineButton
        icon={Maximize2Icon}
        onClick={() => pz.fitToContainer()}
        tooltip="Ajuster au conteneur"
      />
      {hasSelect && (
        <>
          <BTimelineButton icon={DeleteIcon} onClick={controller.onDelete} tooltip="Supprimer" />
          <BTimelineButton icon={ClipboardXIcon} onClick={controller.onCut} tooltip="Couper" />
          <BTimelineButton icon={ClipboardCopyIcon} onClick={controller.onCopy} tooltip="Copier" />
          <BTimelineButton
            icon={ClipboardPasteIcon}
            onClick={controller.onPaste}
            tooltip="Coller"
          />
        </>
      )}
      <div {...c('Sep')} />
      {player && (
        <>
          {playerChildren.map(
            (c) =>
              c && (
                <BTimelineMedia key={c.i} icon={PlusIcon} onClick={controller.onAddMedia} box={c} />
              )
          )}
          <BTimelineMedia
            icon={PlusIcon}
            onClick={controller.onAddMedia}
            tooltip="Ajouter un média"
          />
        </>
      )}
      <div {...c('Sep')} />
      <BTimelineButton
        icon={UndoIcon}
        onClick={controller.onUndo}
        tooltip="Annuler la modification"
      />
      <BTimelineButton
        icon={RedoIcon}
        onClick={controller.onRedo}
        tooltip="Retablir la modification"
      />
      <BTimelineButton
        icon={SaveIcon}
        onClick={controller.onSave}
        tooltip="Enregistrer"
        color="primary"
      />
      <BTimelineButton
        icon={ArrowLeftIcon}
        onClick={controller.onCancel}
        tooltip="Annuler"
        color="error"
      />
    </div>
  );
};
