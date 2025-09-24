import { Css } from '@common/ui';
import { useMsg } from '@common/hooks';
import { FileInfo, MediaModel, Thumb, VideoData, getUrl } from '@common/api';
import { isStrNotEmpty, Msg, uuid } from '@common/utils';
import { useMemo, useState } from 'preact/hooks';

const c = Css('MediaPreview', {
  '': {
    position: 'relative',
    xy: 0,
    wh: '100%',
    userSelect: 'none',
  },
  'Float': {
    position: 'absolute',
    p: 0.2,
    xy: '50%',
    wh: '100%',
    translate: '-50%, -50%',
    bgMode: 'contain',
    transition: 0.2,
    userSelect: 'none',
    fCol: ['center', 'space-around'],
  },
  'Video': {
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
  'Image': {
    flex: 1,
    w: '100%',
    m: 0.2,
    bgMode: 'contain',
  },
  'Title': {
    opacity: 0,
    transition: 0.2,
    hMax: 0,
    fontSize: 0.8,
  },
  '-over &Float': {
    xy: '50%',
    wh: 15,
    zIndex: 100,
    translate: '-50%, -50%',
    rounded: 1,
    bg: 'bg',
    bgMode: 'contain',
    elevation: 2,
  },
  '-over &Title-over': {
    opacity: 1,
    hMax: 3,
    m: 0.2,
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

const getMediaUrl = (v?: Variant, thumb?: Thumb) =>
  (v && getUrl('medias', v.media.id, v.file, thumb)) || '';

const mediaOver$ = new Msg('');

export const MediaPreview = ({ media }: { media?: MediaModel }) => {
  const overId = useMemo(uuid, []);
  const variants = getVariants(media);
  const images = variants.filter((v) => v.type === 'image');
  const videos = variants.filter((v) => v.type === 'video');
  const isOver = useMsg(mediaOver$) === overId;

  if (!media) return null;

  return (
    <div
      class={c('', isOver && `-over`)}
      onMouseOver={() => mediaOver$.set(overId)}
      onMouseLeave={() => mediaOver$.next((p) => (p === overId ? '' : p))}
    >
      <div class={c('Float')}>
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
        ) : (images.length ? (
          <div class={c('Image')} style={{
            backgroundImage: `url('${getMediaUrl(images[0], 360)}')` }}
          />
        ) : null)}
        <span class={c('Title')}>{media.title}</span>
      </div>
    </div>
  );
};
