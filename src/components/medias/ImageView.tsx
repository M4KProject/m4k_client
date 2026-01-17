import { Css } from 'fluxio';
import { MediaViewProps } from './MediaView';
import { ImageMedia } from '@/api/models';
import { useApi } from '@/hooks/useApi';

const c = Css('ImageView', {});

export type ImageViewProps = MediaViewProps<ImageMedia>;

export const ImageView = ({ media, divProps }: ImageViewProps) => {
  const api = useApi();
  const imageUrl = api.medias.getImageUrl(media, 'hd');

  return (
    <div
      {...divProps}
      {...c('', divProps)}
      style={{
        backgroundImage: imageUrl ? `url('${imageUrl}')` : undefined,
        ...divProps?.style,
      }}
    />
  );
};
