import { useApi, useMedias } from '@/hooks/useApi';
import { Css, fluxCombine } from 'fluxio';
import { Media } from '@/api/models';
import { useFluxMemo } from '@/hooks/useFlux';
import { Button } from '@/components/common/Button';
import { useBEditController } from './useBEditController';

const c = Css('BMedias', {
  '': {
    flex: 1,
    row: ['start', 'around'],
    flexWrap: 'wrap',
    gap: 8,
  },
  Item: {
    m: 2,
    wh: 76,
    bg: 'media',
    cursor: 'pointer',
    bgMode: 'cover',
    rounded: 7,
  },
  ' .ButtonSfx': {
    opacity: 0.2,
  },
  'Item-selected': {
    border: 'secondary',
    borderWidth: '3px',
  },
});

const BMediasItem = ({ media }: { media: Media }) => {
  const api = useApi();
  const controller = useBEditController();
  const mediaId = media.id;
  const selected = useFluxMemo(
    () =>
      controller &&
      fluxCombine(controller.select$, controller.items$).map(([select]) => select?.m === mediaId),
    [controller, mediaId]
  );
  const thumbUrl = api.medias.getImageUrl(media, 'thumb');

  return (
    <Button
      {...c('Item', selected && 'Item-selected')}
      tooltip={media.name}
      style={{ backgroundImage: thumbUrl ? `url('${thumbUrl}')` : undefined }}
      onClick={() => {
        const select = controller.select$.get();
        if (select && select.i !== undefined) {
          controller.update(select.i, { m: media.id });
        }
      }}
    />
  );
};

const BMediasContent = () => {
  const medias = useMedias();
  return (
    <>
      {medias.map((media) => (
        <BMediasItem key={media.id} media={media} />
      ))}
    </>
  );
};

export const BMedias = () => {
  return (
    <div {...c('')}>
      <BMediasContent />
    </div>
  );
};

export const BMediasForm = () => {
  return (
    <div {...c('Form')}>
      <BMedias />
    </div>
  );
};
