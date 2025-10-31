import { Css } from '@common/ui';
import { ImageModel } from '@/api';
import { MediaViewProps } from './MediaView';
import { getVariants } from '@/api/getVariants';
import { getMediaUrl } from '@/api/getMediaUrl';

const c = Css('ImageView', {});

export type ImageViewProps = MediaViewProps<ImageModel>;

export const ImageView = ({ media, divProps }: ImageViewProps) => {
  const variants = getVariants(media);
  const images = variants.filter((v) => v.type === 'image');
  const image = images[0];
  const imageUrl = getMediaUrl(image);

  return (
    <div
      {...divProps}
      {...c('', divProps)}
      style={{
        backgroundImage: image ? `url('${imageUrl}')` : undefined,
        ...divProps?.style,
      }}
    />
  );
};
