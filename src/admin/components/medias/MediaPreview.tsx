import { Css } from '@common/ui';
import { FileInfo, MediaModel, Thumb, getUrl } from '@common/api';
import { isStrDef, uuid } from '@common/utils';
import { useMemo } from 'preact/hooks';
import { Popover, useIsOver } from './Popover';

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

interface Variant extends FileInfo {
  media: MediaModel;
  file: string;
}

const getVariants = (media?: MediaModel): Variant[] => {
  if (!media || !media.data) return [];
  const results = [];
  media.data?.variants?.forEach((info, i) => {
    const file = media.variants[i];
    if (isStrDef(file)) {
      results.push({ ...info, file, media });
    }
  });
  if (isStrDef(media.source)) {
    const file = media.source;
    results.push({ ...media, file, media });
  }
  return results;
};

const getMediaUrl = (v?: Variant, thumb?: Thumb) =>
  (v && getUrl('medias', v.media.id, v.file, thumb)) || '';

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
