import { Css } from '@common/ui';
import { PdfModel } from '@common/api';
import { DivProps } from '@common/components';
import { groupBy, sortItems } from '@common/utils';
import { MediaConfig } from './MediaView';
import { getVariants } from '@/api/getVariants';

const c = Css('PdfView', {
  '': {
    position: 'absolute',
    overflow: 'hidden',
    fCenter: 1,
    wh: '100%',
    xy: 0,
  },
});

export type PdfViewProps = DivProps &
  MediaConfig & {
    media?: PdfModel;
  };

export const PdfView = ({ media, ...props }: PdfViewProps) => {
  const variants = getVariants(media);
  const images = variants.filter((v) => v.type === 'image');
  const imagesByPage = groupBy(images, (i) => i.page);
  const pages = sortItems(Object.keys(imagesByPage), Number);

  return <div {...props} class={c(props)} />;
};
