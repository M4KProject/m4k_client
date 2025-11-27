import { Css, isEmpty, truncate } from 'fluxio';
import { useApi } from '@/hooks/useApi';
import { MediaModel } from '@/api/models';
import { useMediaController } from '@/hooks/useMediaController';
import { useOver } from '@/hooks/useOver';
import { Anim } from '../common/Anim';
import { MediaIcon } from '../medias/MediaIcon';
import { useMemo } from 'preact/hooks';

const W = 180;
const H = 130;

const c = Css('MediaItem', {
  '': {
    col: ['stretch', 'center'],
    w: W,
    h: H,
    m: 4,
    cursor: 'pointer',
  },
  Title: {
    textAlign: 'center',
    w: W,
    fg: 'txt',
  },
  Preview: {
    position: 'relative',
    flex: 1,
    bgMode: 'contain',
    m: 4,
    center: 1,
    transition: 0.3,
  },
  Media: {
    position: 'absolute',
    xy: '50%',
    translateX: '-50%',
    translateY: '-50%',
    wMax: '100%',
    hMax: '100%',
    bg: 'bg',
    elevation: 1,
    rounded: 7,
    objectFit: 'contain',
  },
  Video: {
    anim: {
      count: 1,
      duration: 1,
      keyframes: {
        0: { opacity: 0 },
        10: { opacity: 0 },
        100: { opacity: 1 },
      }
    }
  },
  ' .lucide': {
    wh: 50,
  },
  '-over &Preview': {
    zIndex: 10,
  },
});

export const MediaItem = ({ media }: { media: MediaModel }) => {
  const [over, overProps] = useOver();
  const id = media.id;
  const controller = useMediaController();
  const selected = useMemo(() => controller.select$.map(s => s?.id === id), [id]);
  const api = useApi();

  if (!media) return null;

  const variants = api.getVariants(media);
  const images = variants.filter((v) => v.type === 'image');
  const videos = variants.filter((v) => v.type === 'video');

  const previewUrl = api.getMediaUrl(images[0], 360);

  return (
    <div {...c('', selected && '-selected', over && '-over')} {...overProps} onClick={controller.click(media)}>
      {previewUrl ? (
        <div {...c('Preview')}>
          <img {...c('Media')} key="i" src={previewUrl} />
          {!isEmpty(videos) && (
            <Anim show={over} factory={() => (
              <video
                key="v"
                {...c('Media', 'Video')}
                controls={false}
                muted
                autoPlay
                loop
                onLoadStart={(e) => {
                  console.debug('Video LoadStart:', e);
                  e.currentTarget.currentTime = 0;
                }}
                onError={(e) => {
                  console.warn('Video Error:', e);
                }}
              >
                {videos.map((v, i) => (
                  <source key={i} type={v.mime} src={api.getMediaUrl(v)} />
                ))}
              </video>
            )} />
          )}
        </div>
      ) : (
        <MediaIcon {...c('Preview')} type={media.type} />
      )}
      <div {...c('ItemTitle')}>{truncate(media.title, 20)}</div>
    </div>
  );
}
