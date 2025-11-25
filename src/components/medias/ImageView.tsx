import { Css } from 'fluxio';
import { MediaViewProps } from './MediaView';
import { ImageModel } from '@/api/models';
import { useApi } from '@/hooks/useApi';

const c = Css('ImageView', {});

export type ImageViewProps = MediaViewProps<ImageModel>;

export const ImageView = ({ media, divProps }: ImageViewProps) => {
  const api = useApi();
  const variants = api.getVariants(media);
  const images = variants.filter((v) => v.type === 'image');
  const image = images[0];
  const imageUrl = api.getMediaUrl(image);

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
