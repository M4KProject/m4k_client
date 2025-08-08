import { useAsyncEffect, useCss } from '@common/hooks';
import { addJsFileAsync, Css, flexColumn, global } from '@common/helpers';
import { Div } from '@common/components';
import { useRef, useState, useEffect } from 'preact/hooks';
import { TimeSlotSelector } from './TimeSlotSelector';
import { LanguageFlags } from './LanguageFlags';
import { Toolbar } from './Toolbar';

const css: Css = {
  '&': {
    ...flexColumn({ align: 'stretch' }),
    justifyItems: 'stretch',
    flex: 1,
    height: '100%',
    position: 'relative',
  },
  '&TopControls': {
    position: 'absolute',
    top: '20px',
    left: '20px',
    right: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 10,
    pointerEvents: 'none',
  },
  '&Container': {
    flex: 1,
    overflow: 'auto',
    textAlign: 'center',
    position: 'relative',
    minHeight: 0,
  },
};

interface LanguageEntry {
  language: string;
  url: string;
  title: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
}


export const PDFViewer = ({ languageEntries }: { languageEntries: LanguageEntry[] }) => {
  const c = useCss('PDFViewer', css);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1.0);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [allPagesRendered, setAllPagesRendered] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(languageEntries[0]?.language || 'default');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('auto');
  
  // Group entries by time slot for current language
  const currentLanguageEntries = languageEntries.filter(entry => entry.language === currentLanguage);
  
  // Create time slots - each entry gets its own slot
  const timeSlots: Record<string, LanguageEntry> = {};
  
  currentLanguageEntries.forEach((entry, index) => {
    const key = entry.startTime && entry.endTime 
      ? `${entry.startTime}-${entry.endTime}`
      : `entry-${index}`;
    timeSlots[key] = entry;
  });
  
  // Auto-select based on current time
  const getCurrentTimeSlot = (): string => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    for (const [key, entry] of Object.entries(timeSlots)) {
      if (entry.startTime && entry.endTime && 
          currentTime >= entry.startTime && currentTime <= entry.endTime) {
        return key;
      }
    }
    return Object.keys(timeSlots)[0] || 'default';
  };
  
  const activeTimeSlot = selectedTimeSlot === 'auto' ? getCurrentTimeSlot() : selectedTimeSlot;
  const currentEntry = timeSlots[activeTimeSlot] || Object.values(timeSlots)[0];
  const url = currentEntry?.url || '';

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
      canvas.style.margin = '10px auto';
      canvas.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const context = canvas.getContext('2d');
      if (!context) continue;

      const renderContext = {
        canvasContext: context,
        viewport: viewport
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

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
    setCurrentPage(1);
    setPdfDoc(null);
    setAllPagesRendered(false);
    setSelectedTimeSlot('auto'); // Reset to auto when changing language
  };

  const handleTimeSlotChange = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
    setCurrentPage(1);
    setPdfDoc(null);
    setAllPagesRendered(false);
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

    await addJsFileAsync("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js");

    // Assure-toi que pdfjsLib est bien disponible globalement
    const pdfjsLib = global.pdfjsLib;
    console.debug('PDFViewer useAsyncEffect pdfjsLib', pdfjsLib);

    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    const pdf = await pdfjsLib.getDocument(url).promise;
    console.debug('PDFViewer useAsyncEffect pdf', pdf);

    // Set pdfDoc and page info first
    setPdfDoc(pdf);
    setTotalPages(pdf.numPages);
    setCurrentPage(1);
    setAllPagesRendered(false);
    
    // Render all pages directly with pdf reference
    containerEl.innerHTML = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      canvas.style.display = 'block';
      canvas.style.margin = '10px auto';
      canvas.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const context = canvas.getContext('2d');
      if (!context) continue;

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      
      await page.render(renderContext).promise;
      containerEl.appendChild(canvas);
    }
    
    setAllPagesRendered(true);

    console.debug('PDFViewer initial render complete');
  }, [url, currentLanguage, selectedTimeSlot]);

  console.debug('PDFViewer', { url });

  return (
    <Div cls={`${c}`}>
      <Div cls={`${c}TopControls`}>
        <TimeSlotSelector
          languageEntries={currentLanguageEntries}
          selectedTimeSlot={selectedTimeSlot}
          activeTimeSlot={activeTimeSlot}
          onTimeSlotChange={handleTimeSlotChange}
        />
        
        <LanguageFlags
          languageEntries={languageEntries}
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
        />
      </Div>
      
      <div className={`${c}Container`} ref={containerRef} />
      
      <Toolbar
        currentPage={currentPage}
        totalPages={totalPages}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitWidth={handleFitWidth}
      />
    </Div>
  );
};