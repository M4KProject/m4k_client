import { Css } from '@common/ui';
import { ImageModel } from '@common/api';
import { DivProps } from '@common/components';
import { MediaConfig } from './MediaView';
import { getVariants } from '@/api/getVariants';
import { getMediaUrl } from '@/api/getMediaUrl';

const c = Css('ImageView', {
  '': {
    position: 'absolute',
    overflow: 'hidden',
    fCenter: 1,
    wh: '100%',
    xy: 0,
  },
});

export type ImageViewProps = DivProps &
  MediaConfig & {
    media?: ImageModel;
  };

export const ImageView = ({ media, ...props }: ImageViewProps) => {
  const variants = getVariants(media);
  const images = variants.filter((v) => v.type === 'image');
  const image = images[0];

  return (
    <div
      {...props}
      class={c(props)}
      style={{
        backgroundImage: image ? `url('${getMediaUrl(image)}')` : undefined,
        ...props.style,
      }}
    />
  );
};
