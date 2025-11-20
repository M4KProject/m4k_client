import { Css } from 'fluxio';
import { useApi } from '@/hooks/apiHooks';
import { MediaViewProps } from './MediaView';
import { VideoModel } from '@/api/models';

const c = Css('VideoView', {
  '': {
    bgMode: 'cover',
  },
  Video: {
    wh: '100%',
    itemFit: 'fill',
  },
  'Video-contain': {
    itemFit: 'contain',
  },
  'Video-cover': {
    itemFit: 'cover',
  },
  'Video-fill': {
    itemFit: 'fill',
  },
});

export type VideoViewProps = MediaViewProps<VideoModel>;

export const VideoView = ({ media, onNext, fit, divProps }: VideoViewProps) => {
  const api = useApi();
  const variants = api.getVariants(media);
  const videos = variants.filter((v) => v.type === 'video');
  const images = variants.filter((v) => v.type === 'image');
  const posterImage = images[0];

  return (
    <div
      {...divProps}
      {...c('', divProps)}
      style={{
        backgroundImage: posterImage ? `url('${api.getMediaUrl(posterImage)}')` : undefined,
        ...divProps?.style,
      }}
    >
      <video
        {...c('Video', fit && `Video-${fit}`)}
        controls={false}
        autoPlay={true}
        muted={true}
        loop={true}
        onEnded={onNext}
        onError={(e) => {
          console.warn('Video load error:', e);
          onNext?.();
        }}
      >
        {videos.map((v, i) => (
          <source key={i} type={v.mime} src={api.getMediaUrl(v)} />
        ))}
        Votre navigateur ne supporte pas la lecture vidéo.
      </video>
    </div>
  );
};
