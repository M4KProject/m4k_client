import { Css } from '@common/ui';
import { VideoModel } from '@common/api';
import { DivProps } from '@common/components';
import { MediaConfig } from './MediaView';
import { getVariants } from '@/api/getVariants';
import { getMediaUrl } from '@/api/getMediaUrl';

const c = Css('VideoView', {
  '': {
    position: 'absolute',
    overflow: 'hidden',
    fCenter: 1,
    wh: '100%',
    xy: 0,
  },
});

export type VideoViewProps = DivProps &
  MediaConfig & {
    media?: VideoModel;
  };

export const VideoView = ({ media, ...props }: VideoViewProps) => {
  const variants = getVariants(media);
  const videos = variants.filter((v) => v.type === 'video');

  return (
    <div {...props} class={c(props)}>
      <video
        controls={false}
        autoPlay={true}
        muted={true}
        onError={(e) => {
          console.warn('Video load error:', e);
        }}
      >
        {videos.map((v, i) => (
          <source key={i} type={v.mime} src={getMediaUrl(v)} />
        ))}
        Votre navigateur ne supporte pas la lecture vidéo.
      </video>
    </div>
  );
};
