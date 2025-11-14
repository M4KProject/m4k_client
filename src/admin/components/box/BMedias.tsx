import { useGroupMedias } from '@/api/hooks';
import { Css } from 'fluxio';
import { MediaModel } from '@/api/models';
import { getMediaUrl } from '@/api/getMediaUrl';
import { getVariants } from '@/api/getVariants';
import { useBCtrl } from '@/components/box/BCtrl';
import { useFlux } from '@/hooks/useFlux';
import { Button } from '@/components/Button';

const c = Css('BMedias', {
  '': {
    flex: 1,
    elevation: 1,
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
    border: 'p',
  },
});

const MediaItem = ({ media }: { media: MediaModel }) => {
  const ctrl = useBCtrl();
  const click = useFlux(ctrl.click$);
  const selected = click.item?.media === media.id;
  const variants = getVariants(media);
  const image = variants.find(v => v.type === 'image');
  const url = image ? getMediaUrl(image, 80) : undefined;

  return (
    <Button
      {...c('Item', selected && 'Item-selected')}
      tooltip={media.title}
      style={{ backgroundImage: url ? `url('${url}')` : undefined }}
      onClick={() => {
        if (click.i !== undefined) {
          ctrl.update(click.i, { media: media.id });
        }
      }}
    />
  );
};

export const BMedias = () => {
  const medias = useGroupMedias();

  return (
    <div {...c()}>
      {medias.map(media => (
        <MediaItem key={media.id} media={media} />
      ))}
    </div>
  );
};
