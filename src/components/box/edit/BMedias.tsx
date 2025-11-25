import { useApi, useGroupMedias } from '@/hooks/useApi';
import { Css, fluxCombine } from 'fluxio';
import { MediaModel } from '@/api/models';
import { useBController } from '@/components/box/BController';
import { useFluxMemo } from '@/hooks/useFlux';
import { Button } from '@/components/common/Button';

const c = Css('BMedias', {
  '': {
    flex: 1,
    m: 4,
    p: 4,
    row: ['start', 'around'],
    flexWrap: 'wrap',
    gap: 8,
  },
  Item: {
    wh: 80,
    bg: 'media',
    cursor: 'pointer',
    bgMode: 'cover',
    border: 'border',
    rounded: 7,
  },
  ' .ButtonSfx': {
    opacity: 0.2,
  },
  'Item-selected': {
    border: 's',
    borderWidth: '3px',
  },
});

const BMediasItem = ({ media }: { media: MediaModel }) => {
  const api = useApi();
  const ctrl = useBController();
  const mediaId = media.id;
  const selected = useFluxMemo(
    () => fluxCombine(ctrl.select$, ctrl.items$).map(([click]) => ctrl.get(click.i)?.m === mediaId),
    [ctrl, mediaId]
  );
  const variants = api.getVariants(media);
  const image = variants.find((v) => v.type === 'image');
  const url = image ? api.getMediaUrl(image, 80) : undefined;

  return (
    <Button
      {...c('Item', selected && 'Item-selected')}
      tooltip={media.title}
      style={{ backgroundImage: url ? `url('${url}')` : undefined }}
      onClick={() => {
        const select = ctrl.select$.get();
        if (select.i !== undefined) {
          ctrl.update(select.i, { m: media.id });
        }
      }}
    />
  );
};

const BMediasContent = () => {
  const medias = useGroupMedias();
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
