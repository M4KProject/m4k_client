import { useAsyncEffect, useCss } from '@common/hooks';
import { addJsFileAsync, Css, flexColumn, global } from '@common/helpers';
import { Button, Div, Field } from '@common/components';
import { useRef, useState, useEffect } from 'preact/hooks';
import { MdFitScreen, MdZoomIn, MdZoomOut, MdNavigateBefore, MdNavigateNext } from 'react-icons/md';

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
  '&TimeSlotSelector': {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    minWidth: '200px',
    pointerEvents: 'auto',
  },
  '&LanguageFlags': {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    pointerEvents: 'auto',
  },
  '&Container': {
    flex: 1,
    overflow: 'auto',
    textAlign: 'center',
    position: 'relative',
    minHeight: 0,
  },
  '&Toolbar': {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  '&PageInfo': {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
    padding: '0 10px',
    whiteSpace: 'nowrap',
  },
  '&LanguageButton': {
    fontSize: '20px',
    padding: '5px 8px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    opacity: 0.6,
    transition: 'opacity 0.2s, backgroundColor 0.2s',
  },
  '&LanguageButton:hover': {
    opacity: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  '&LanguageButton.active': {
    opacity: 1,
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    border: '1px solid rgba(0, 123, 255, 0.3)',
  },
  '& .Button-primary': {
    bg: '#7a624a',
  },
  '& .Button-primary .ButtonIcon': {
    fg: '#7a624a',
  },
  '& .Button-secondary': {
    bg: '#5a5a5a',
  },
  '& .Button-secondary .ButtonIcon': {
    fg: '#5a5a5a',
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

const getLanguageFlag = (language: string): string => {
  const flagMap: Record<string, string> = {
    'fr': '🇫🇷',
    'en': '🇬🇧',
    'es': '🇪🇸',
    'de': '🇩🇪',
    'it': '🇮🇹',
    'pt': '🇵🇹',
    'nl': '🇳🇱',
    'default': '🏳️'
  };
  return flagMap[language.toLowerCase()] || '🏳️';
};

export const PDFViewer = ({ languageEntries }: { languageEntries: LanguageEntry[] }) => {
  const c = useCss('PDFViewer', css);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1.0);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState(languageEntries[0]?.language || 'default');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('auto');
  
  // Group entries by time slot for current language
  const currentLanguageEntries = languageEntries.filter(entry => entry.language === currentLanguage);
  
  // Create time slots with auto-selection
  const timeSlots = currentLanguageEntries.reduce((slots, entry) => {
    const key = entry.startTime && entry.endTime 
      ? `${entry.startTime}-${entry.endTime}`
      : 'default';
    if (!slots[key]) {
      slots[key] = entry;
    }
    return slots;
  }, {} as Record<string, LanguageEntry>);
  
  // Add 'auto' option
  const timeSlotOptions = {
    'auto': 'Automatique',
    ...Object.keys(timeSlots).reduce((opts, key) => {
      const entry = timeSlots[key];
      opts[key] = key === 'default' 
        ? entry.title 
        : `${entry.startTime} - ${entry.endTime}`;
      return opts;
    }, {} as Record<string, string>)
  };
  
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

  const renderPage = async (scale: number, pageNum: number = currentPage) => {
    console.debug('PDFViewer renderPage', url, scale, pageNum);

    if (!pdfDoc || !canvasRef.current || pageNum < 1 || pageNum > totalPages) return;

    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    await page.render(renderContext).promise;
  };

  const handleZoomIn = () => {
    const newScale = scale + 0.2;
    console.debug('PDFViewer handleZoomIn', url, newScale);
    setScale(newScale);
    renderPage(newScale);
  };

  const handleZoomOut = () => {
    const newScale = Math.max(0.2, scale - 0.2);
    console.debug('PDFViewer handleZoomOut', url, newScale);
    setScale(newScale);
    renderPage(newScale);
  };

  const handleFitWidth = () => {
    console.debug('PDFViewer handleFitWidth', url);
    if (!pdfDoc || !containerRef.current) return;

    const page = pdfDoc.getPage(currentPage);
    page.then((p: any) => {
      const viewport = p.getViewport({ scale: 1 });
      const containerWidth = containerRef.current!.offsetWidth;
      const fitScale = containerWidth / viewport.width;

      setScale(fitScale);
      renderPage(fitScale, currentPage);
    });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      renderPage(scale, newPage);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      renderPage(scale, newPage);
    }
  };

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
    setCurrentPage(1);
    setPdfDoc(null);
    setSelectedTimeSlot('auto'); // Reset to auto when changing language
  };

  const handleTimeSlotChange = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
    setCurrentPage(1);
    setPdfDoc(null);
  };

  // Auto-refresh time slot selection every minute if in auto mode
  useEffect(() => {
    if (selectedTimeSlot !== 'auto') return;
    
    const interval = setInterval(() => {
      // This will trigger a re-render and update the activeTimeSlot
      setCurrentPage(prev => prev); // Force re-render without changing state
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [selectedTimeSlot, timeSlots]);

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

    const canvas = document.createElement('canvas');
    canvas.style.display = 'block';
    canvas.style.margin = '0 auto';
    canvasRef.current = canvas;
    containerEl.innerHTML = '';
    containerEl.appendChild(canvas);

    console.debug('PDFViewer useAsyncEffect canvas', canvas);

    // Set pdfDoc and page info
    setPdfDoc(pdf);
    setTotalPages(pdf.numPages);
    setCurrentPage(1);
    
    // Render the first page immediately
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale });
    
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    await page.render(renderContext).promise;

    console.debug('PDFViewer initial render complete');
  }, [url, currentLanguage, selectedTimeSlot]);

  console.debug('PDFViewer', { url });

  return (
    <Div cls={`${c}`}>
      <Div cls={`${c}TopControls`}>
        {Object.keys(timeSlotOptions).length > 1 && (
          <Div cls={`${c}TimeSlotSelector`}>
            <Field
              type="select"
              label="Plage horaire"
              value={selectedTimeSlot}
              values={timeSlotOptions}
              onChange={(value: string) => handleTimeSlotChange(value)}
            />
          </Div>
        )}
        
        {languageEntries.length > 1 && (
          <Div cls={`${c}LanguageFlags`}>
            {languageEntries.map(entry => (
              <Button
                key={entry.language}
                cls={`${c}LanguageButton ${entry.language === currentLanguage ? 'active' : ''}`}
                color={entry.language === currentLanguage ? "primary" : "secondary"} 
                onClick={() => handleLanguageChange(entry.language)}
              >
                {getLanguageFlag(entry.language)}
              </Button>
            ))}
          </Div>
        )}
      </Div>
      
      <div className={`${c}Container`} ref={containerRef} />
      <Div cls={`${c}Toolbar`}>
        <Button 
          icon={<MdNavigateBefore />} 
          color={currentPage <= 1 ? "secondary" : "primary"} 
          onClick={currentPage <= 1 ? undefined : handlePreviousPage}
        />
        <Div cls={`${c}PageInfo`}>
          {currentPage} / {totalPages}
        </Div>
        <Button 
          icon={<MdNavigateNext />} 
          color={currentPage >= totalPages ? "secondary" : "primary"} 
          onClick={currentPage >= totalPages ? undefined : handleNextPage}
        />
        <Button icon={<MdZoomOut />} color="primary" onClick={handleZoomOut} />
        <Button icon={<MdZoomIn />} color="primary" onClick={handleZoomIn} />
        <Button icon={<MdFitScreen />} color="primary" onClick={handleFitWidth} />
      </Div>
    </Div>
  );
};