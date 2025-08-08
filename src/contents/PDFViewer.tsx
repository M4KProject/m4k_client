import { useAsyncEffect, useCss } from '@common/hooks';
import { addJsFileAsync, Css, flexColumn, global } from '@common/helpers';
import { Button, Div } from '@common/components';
import { useRef, useState, useEffect } from 'preact/hooks';
import { MdFitScreen, MdZoomIn, MdZoomOut, MdNavigateBefore, MdNavigateNext, MdAccessTime } from 'react-icons/md';

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
    pointerEvents: 'auto',
    position: 'relative',
  },
  '&TimeSlotButton': {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '8px 12px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
  },
  '&TimeSlotDropdown': {
    position: 'absolute',
    top: '100%',
    left: '0',
    marginTop: '5px',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    minWidth: '250px',
    maxWidth: '350px',
    overflow: 'hidden',
    zIndex: 20,
  },
  '&TimeSlotOption': {
    padding: '12px 16px',
    cursor: 'pointer',
    borderBottom: '1px solid #f0f0f0',
    fontSize: '14px',
    color: '#333',
  },
  '&TimeSlotOption:hover': {
    backgroundColor: '#f5f5f5',
  },
  '&TimeSlotOption:last-child': {
    borderBottom: 'none',
  },
  '&TimeSlotOption.active': {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    fontWeight: 'bold',
  },
  '&TimeSlotOption.current': {
    fontWeight: 'bold',
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
  const [scale, setScale] = useState(1.0);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [allPagesRendered, setAllPagesRendered] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(languageEntries[0]?.language || 'default');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('auto');
  const [isTimeSlotDropdownOpen, setIsTimeSlotDropdownOpen] = useState(false);
  // Get current time
  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };
  
  const [currentTime, setCurrentTime] = useState(() => getCurrentTime());
  
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
  
  // Add 'auto' option with current time
  const timeSlotOptions = {
    'auto': `Automatique (${currentTime})`,
    ...Object.keys(timeSlots).reduce((opts, key) => {
      const entry = timeSlots[key];
      opts[key] = entry.title;
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
    setIsTimeSlotDropdownOpen(false);
  };

  const toggleTimeSlotDropdown = () => {
    setIsTimeSlotDropdownOpen(!isTimeSlotDropdownOpen);
  };

  const getCurrentTimeSlotLabel = (): string => {
    if (selectedTimeSlot === 'auto') {
      return `Automatique (${currentTime})`;
    }
    return timeSlotOptions[selectedTimeSlot] || 'Automatique';
  };

  // Auto-refresh time slot selection every minute if in auto mode
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isTimeSlotDropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`[data-dropdown="timeslot"]`)) {
        setIsTimeSlotDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isTimeSlotDropdownOpen]);

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
        {Object.keys(timeSlotOptions).length > 1 && (
          <Div cls={`${c}TimeSlotSelector`} data-dropdown="timeslot">
            <button 
              className={`${c}TimeSlotButton`}
              onClick={toggleTimeSlotDropdown}
            >
              <MdAccessTime size={16} />
              <span>Plage horaire : {getCurrentTimeSlotLabel()}</span>
            </button>
            
            {isTimeSlotDropdownOpen && (
              <Div cls={`${c}TimeSlotDropdown`}>
                {Object.entries(timeSlotOptions).map(([key, label]) => {
                  const isActive = key === selectedTimeSlot;
                  const isCurrent = key === activeTimeSlot && selectedTimeSlot === 'auto';
                  const className = `${c}TimeSlotOption ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`;
                  
                  return (
                    <div
                      key={key}
                      className={className}
                      onClick={() => handleTimeSlotChange(key)}
                    >
                      {label}
                      {key !== 'auto' && timeSlots[key]?.startTime && timeSlots[key]?.endTime && (
                        <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '2px' }}>
                          {timeSlots[key].startTime} - {timeSlots[key].endTime}
                        </div>
                      )}
                    </div>
                  );
                })}
              </Div>
            )}
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