import { Css } from '@common/ui';
import { PdfModel } from '@/api';
import { Button } from '@common/components';
import { groupBy, sortItems } from 'fluxio';
import { useState } from 'preact/hooks';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaViewProps } from './MediaView';
import { getVariants } from '@/api/getVariants';
import { getMediaUrl } from '@/api/getMediaUrl';
import { PanZoom } from './PanZoom';

const c = Css('PdfView', {
  '': {
    position: 'absolute',
    overflow: 'hidden',
    fCenter: [],
    wh: '100%',
    xy: 0,
  },
  Container: {
    position: 'absolute',
    inset: 0,
    overflow: 'auto',
    bg: 'b2',
  },
  Page: {
    position: 'absolute',
    xy: 0,
    wh: '100%',
    bgMode: 'contain',
  },
  Toolbar: {
    position: 'absolute',
    b: 1.25,
    l: '50%',
    translateX: '-50%',
    fRow: ['center', 'center'],
    gap: 0.5,
    zIndex: 10,
    bg: 'b1',
    opacity: 0.9,
    p: 0.5,
    rounded: 2,
    elevation: 2,
  },
  PageNbr: {
    bold: 1,
    fg: 'f1',
    px: 0.5,
    whiteSpace: 'nowrap',
  },
});

export type PdfViewProps = MediaViewProps<PdfModel>;

export const PdfView = ({ media, divProps }: PdfViewProps) => {
  const [currentPage, setCurrentPage] = useState(0);

  const variants = getVariants(media);
  const images = variants.filter((v) => v.type === 'image');
  const imagesByPage = groupBy(images, (i) => i.page);
  const pages = sortItems(Object.keys(imagesByPage), Number);
  const totalPages = pages.length;

  if (!media || totalPages === 0) return null;

  const currentPageKey = pages[currentPage] || '';
  const currentImage = imagesByPage[currentPageKey]?.[0];

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div {...divProps} {...c(divProps)}>
      <PanZoom {...c('Container')}>
        {currentImage && (
          <div
            {...c('Page')}
            style={{
              backgroundImage: `url('${getMediaUrl(currentImage)}')`,
            }}
          />
        )}
      </PanZoom>

      <div {...c('Toolbar')}>
        <Button
          icon={<ChevronLeft />}
          color={currentPage <= 0 ? 'secondary' : 'primary'}
          onClick={currentPage <= 0 ? undefined : handlePreviousPage}
        />
        <div {...c('PageNbr')}>
          {currentPage + 1} / {totalPages}
        </div>
        <Button
          icon={<ChevronRight />}
          color={currentPage >= totalPages - 1 ? 'secondary' : 'primary'}
          onClick={currentPage >= totalPages - 1 ? undefined : handleNextPage}
        />
      </div>
    </div>
  );
};
