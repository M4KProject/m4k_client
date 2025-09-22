import { Css } from '@common/ui';
import { useMsg } from '@common/hooks';
import { FileInfo, MediaModel, getUrl } from '@common/api';
import { isStrNotEmpty, Msg } from '@common/utils';

const c = Css('MediaPreview', {
  '': {
    position: 'relative',
    xy: 0,
    wh: '100%',
    userSelect: 'none',
  },
  ' div': {
    position: 'absolute',
    xy: '50%',
    wh: '100%',
    translate: '-50%, -50%',
    bgMode: 'contain',
    transition: 0.2,
    userSelect: 'none',
  },
  '-over div': {
    xy: '50%',
    wh: 15,
    zIndex: 1,
    translate: '-50%, -50%',
    rounded: 1,
  },
  ' video': {
    wh: '100%',
    objectFit: 'contain',
    cursor: 'pointer',
  },
});

interface Variant extends FileInfo {
  media: MediaModel;
  file: string;
}

const getVariants = (media?: MediaModel): Variant[] => {
  if (!media || !media.data) return [];
  const results = [];
  media.data.variants.forEach((info, i) => {
    const file = media.variants[i];
    if (isStrNotEmpty(file)) {
      results.push({ ...info, file, media });
    }
  });
  if (isStrNotEmpty(media.source)) {
    const file = media.source;
    results.push({ ...media, file, media });
  }
  return results;
};

const getMediaUrl = (v?: Variant, thumb?: [number, number]) =>
  (v && getUrl('medias', v.media.id, v.file)) || '';

const mediaOver$ = new Msg('');

export const MediaPreview = ({ media }: { media: MediaModel }) => {
  const variants = getVariants(media);

  const images = variants.filter((v) => v.type === 'image');
  const videos = variants.filter((v) => v.type === 'video');

  const isOver = useMsg(mediaOver$) === media.id;

  return (
    <div
      class={c('', isOver && `-over`)}
      onMouseOver={() => mediaOver$.set(media.id)}
      onMouseLeave={() => mediaOver$.next((p) => (p === media.id ? '' : p))}
    >
      <div style={{ backgroundImage: `url("${getMediaUrl(images[0], [300, 300])}")` }}>
        {isOver && videos.length ? (
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
        ) : null}
      </div>
    </div>
  );
};
