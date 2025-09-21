import { useAsyncEffect } from '@common/hooks';
import { addJsFileAsync, Css, flexColumn } from '@common/ui';
import { global } from '@common/utils';

import { useRef, useState, useEffect } from 'preact/hooks';
import { PDFToolbar } from './PDFToolbar';

const c = Css('PDFViewer', {
  '&': {
    ...flexColumn({ align: 'stretch' }),
    justifyItems: 'stretch',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  '&Container': {
    flex: 1,
    overflow: 'auto',
    textAlign: 'center',
    position: 'relative',
    minHeight: 0,
    paddingBottom: '80px', // Space for toolbar
  },
});

export const PDFViewer = ({ url }: { url: string }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1.0);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [allPagesRendered, setAllPagesRendered] = useState(false);

  const renderAllPages = async (scale: number) => {
    console.debug('PDFViewer renderAllPages', url, scale);

    if (!pdfDoc || !containerRef.current) return;

    const containerEl = containerRef.current;
    containerEl.innerHTML = '';

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      canvas.style.display = 'block';
      canvas.style.margin = '0 auto';
      canvas.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const context = canvas.getContext('2d');
      if (!context) continue;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
      containerEl.appendChild(canvas);
    }

    setAllPagesRendered(true);
  };

  const handleZoomIn = () => {
    const newScale = scale + 0.2;
    console.debug('PDFViewer handleZoomIn', url, newScale);
    setScale(newScale);
    if (allPagesRendered) {
      renderAllPages(newScale);
    }
  };

  const handleZoomOut = () => {
    const newScale = Math.max(0.2, scale - 0.2);
    console.debug('PDFViewer handleZoomOut', url, newScale);
    setScale(newScale);
    if (allPagesRendered) {
      renderAllPages(newScale);
    }
  };

  const handleFitWidth = () => {
    console.debug('PDFViewer handleFitWidth', url);
    if (!pdfDoc || !containerRef.current) return;

    const page = pdfDoc.getPage(1);
    page.then((p: any) => {
      const viewport = p.getViewport({ scale: 1 });
      const containerWidth = containerRef.current!.offsetWidth;
      const fitScale = containerWidth / viewport.width;

      setScale(fitScale);
      if (allPagesRendered) {
        renderAllPages(fitScale);
      }
    });
  };

  const scrollToPage = (pageNum: number) => {
    if (!containerRef.current || !allPagesRendered) return;

    const canvases = containerRef.current.querySelectorAll('canvas');
    const targetCanvas = canvases[pageNum - 1];
    if (targetCanvas) {
      targetCanvas.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      scrollToPage(newPage);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      scrollToPage(newPage);
    }
  };

  // Track which page is currently visible
  useEffect(() => {
    if (!allPagesRendered || !containerRef.current) return;

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const canvas = entry.target as HTMLCanvasElement;
          const canvases = Array.from(containerRef.current!.querySelectorAll('canvas'));
          const pageIndex = canvases.indexOf(canvas);
          if (pageIndex !== -1) {
            setCurrentPage(pageIndex + 1);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: containerRef.current,
      threshold: 0.5,
    });

    const canvases = containerRef.current.querySelectorAll('canvas');
    canvases.forEach((canvas) => observer.observe(canvas));

    return () => observer.disconnect();
  }, [allPagesRendered]);

  useAsyncEffect(async () => {
    const containerEl = containerRef.current;
    if (!containerEl || typeof containerEl.appendChild !== 'function') {
      console.error('PDFViewer: containerEl is not a valid DOM element', containerEl);
      return;
    }

    console.debug('PDFViewer useAsyncEffect', containerEl);

    await addJsFileAsync('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');

    // Assure-toi que pdfjsLib est bien disponible globalement
    const pdfjsLib = global.pdfjsLib;
    console.debug('PDFViewer useAsyncEffect pdfjsLib', pdfjsLib);

    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    const pdf = await pdfjsLib.getDocument(url).promise;
    console.debug('PDFViewer useAsyncEffect pdf', pdf);

    // Set pdfDoc and page info first
    setPdfDoc(pdf);
    setTotalPages(pdf.numPages);
    setCurrentPage(1);
    setAllPagesRendered(false);

    // Render all pages directly with pdf reference
    containerEl.innerHTML = '';

    // Calculate fit width scale based on first page
    const firstPage = await pdf.getPage(1);
    const firstViewport = firstPage.getViewport({ scale: 1 });
    const containerWidth = containerEl.offsetWidth;
    const fitScale = containerWidth / firstViewport.width;

    // Use the calculated fit scale instead of the default scale
    const actualScale = fitScale;
    setScale(actualScale);

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: actualScale });

      const canvas = document.createElement('canvas');
      canvas.style.display = 'block';
      canvas.style.margin = '0 auto';
      canvas.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const context = canvas.getContext('2d');
      if (!context) continue;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
      containerEl.appendChild(canvas);
    }

    setAllPagesRendered(true);

    console.debug('PDFViewer initial render complete');
  }, [url]);

  console.debug('PDFViewer', { url });

  return (
    <div class={c()}>
      <div class={c('Container')} ref={containerRef} />

      <PDFToolbar
        currentPage={currentPage}
        totalPages={totalPages}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitWidth={handleFitWidth}
      />
    </div>
  );
};
