import { Css } from 'fluxio';
import { groupBy, sortItems } from 'fluxio';
import { useState, useEffect, useMemo } from 'preact/hooks';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaViewProps } from './MediaView';
import { PanZoom, PanZoomController } from '@/components/common/PanZoom';
import { PdfModel } from '@/api/models';
import { Button } from '@/components/common/Button';
import { useApi } from '@/hooks/useApi';
import { app } from '@/app';

const c = Css('PdfView', {
  '': {
    position: 'absolute',
    overflow: 'hidden',
    center: 1,
    wh: '100%',
    xy: 0,
  },
  Container: {
    position: 'absolute',
    inset: 0,
    overflow: 'auto',
    bg: 'bg',
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
    row: ['center', 'center'],
    gap: 0.5,
    zIndex: 10,
    bg: 'bg',
    opacity: 0.9,
    p: 4,
    rounded: 5,
    elevation: 2,
  },
  PageNbr: {
    bold: 1,
    fg: 'f1',
    px: 4,
    whiteSpace: 'nowrap',
  },
});

export type PdfViewProps = MediaViewProps<PdfModel>;

export const PdfView = ({ media, divProps }: PdfViewProps) => {
  const api = useApi();
  const [currentPage, setCurrentPage] = useState(0);
  const panZoom = useMemo(() => new PanZoomController(), []);

  const variants = api.getVariants(media);
  const images = variants.filter((v) => v.type === 'image');
  const imagesByPage = groupBy(images, (i) => i.page);
  const pages = sortItems(Object.keys(imagesByPage), Number);
  const totalPages = pages.length;

  if (!media || totalPages === 0) return null;

  const currentPageKey = pages[currentPage] || '';
  const currentImage = imagesByPage[currentPageKey]?.[0];

  useEffect(() => {
    app.pdfPanZoom = panZoom;
    const unsubscribe = panZoom.ready$.on(() => {
      if (currentImage?.width && currentImage?.height) {
        panZoom.setSize(currentImage.width, currentImage.height);
      }
    });
    return unsubscribe;
  }, [currentImage, panZoom]);

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
      <PanZoom controller={panZoom} {...c('Container')}>
        {currentImage && (
          <div
            {...c('Page')}
            style={{
              backgroundImage: `url('${api.getMediaUrl(currentImage)}')`,
              width: `${currentImage.width}px`,
              height: `${currentImage.height}px`,
            }}
          />
        )}
      </PanZoom>

      <div {...c('Toolbar')}>
        <Button
          icon={ChevronLeft}
          color={currentPage <= 0 ? 'secondary' : 'primary'}
          onClick={currentPage <= 0 ? undefined : handlePreviousPage}
        />
        <div {...c('PageNbr')}>
          {currentPage + 1} / {totalPages}
        </div>
        <Button
          icon={ChevronRight}
          color={currentPage >= totalPages - 1 ? 'secondary' : 'primary'}
          onClick={currentPage >= totalPages - 1 ? undefined : handleNextPage}
        />
      </div>
    </div>
  );
};
