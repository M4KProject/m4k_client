import { Css } from '@common/ui';
import { MediaModel } from '@common/api';
import { uuid } from '@common/utils';
import { useMemo } from 'preact/hooks';
import { Popover, useIsOver } from './Popover';
import { getVariants } from '@/api/getVariants';
import { getMediaUrl } from '@/api/getMediaUrl';

const c = Css('MediaPreview', {
  Video: {
    flex: 1,
    w: '100%',
    m: 0.2,
  },
  'Video video': {
    wh: '100%',
    flex: 1,
    objectFit: 'contain',
    cursor: 'pointer',
  },
  Image: {
    flex: 1,
    w: '100%',
    m: 0.2,
    bgMode: 'contain',
  },
});

export const MediaPreview = ({ media }: { media?: MediaModel }) => {
  const overId = useMemo(uuid, []);
  const variants = getVariants(media);
  const images = variants.filter((v) => v.type === 'image');
  const videos = variants.filter((v) => v.type === 'video');
  const isOver = useIsOver(overId);

  if (!media) return null;

  return (
    <Popover id={overId} class={c('')} title={media.title}>
      {isOver && videos.length ? (
        <div class={c('Video')}>
          <video
            controls={false}
            muted
            autoPlay
            loop
            onLoadStart={(e) => {
              e.currentTarget.currentTime = 0;
            }}
            onError={(e) => {
              console.warn('Video preview error:', e);
            }}
          >
            {videos.map((v, i) => (
              <source key={i} type={v.mime} src={getMediaUrl(v)} />
            ))}
          </video>
        </div>
      ) : images.length ? (
        <div
          class={c('Image')}
          style={{
            backgroundImage: `url('${getMediaUrl(images[0], 360)}')`,
          }}
        />
      ) : null}
    </Popover>
  );
};
