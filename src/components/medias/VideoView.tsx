import { Css } from 'fluxio';
import { useApi } from '@/hooks/useApi';
import { MediaViewProps } from './MediaView';
import { VideoMedia } from '@/api/models';

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

export type VideoViewProps = MediaViewProps<VideoMedia>;

export const VideoView = ({ media, onNext, fit, divProps }: VideoViewProps) => {
  const api = useApi();
  const videos = api.medias.getVideoInfos(media, 'hd');
  const images = api.medias.getImageInfos(media, 'hd');
  const posterImage = images[0];

  return (
    <div
      {...divProps}
      {...c('', divProps)}
      style={{
        backgroundImage: posterImage ? `url('${posterImage.url}')` : undefined,
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
          <source key={i} type={v.mime} src={v.url} />
        ))}
        Votre navigateur ne supporte pas la lecture vidéo.
      </video>
    </div>
  );
};
