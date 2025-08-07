import { useAsyncEffect, useCss } from '@common/hooks';
import { addJsFileAsync, Css, flexColumn, global } from '@common/helpers';
import { Button, Div } from '@common/components';
import { useRef, useState } from 'preact/hooks';
import { MdFitScreen, MdZoomIn, MdZoomOut, MdNavigateBefore, MdNavigateNext } from 'react-icons/md';

const css: Css = {
  '&': {
    ...flexColumn({ align: 'stretch' }),
    justifyItems: 'stretch',
    flex: 1,
    height: '100%',
    position: 'relative',
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
  '&LanguageFlags': {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
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
  
  const currentEntry = languageEntries.find(entry => entry.language === currentLanguage) || languageEntries[0];
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
  };

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
  }, [url, currentLanguage]);

  console.debug('PDFViewer', { url });

  return (
    <Div cls={`${c}`}>
      <div className={`${c}Container`} ref={containerRef} />
      <Div cls={`${c}Toolbar`}>
        {languageEntries.length > 1 && (
          <Div cls={`${c}LanguageFlags`}>
            {languageEntries.map(entry => (
              <Button
                key={entry.language}
                cls={`${c}LanguageButton ${entry.language === currentLanguage ? 'active' : ''}`}
                color={currentPage <= 1 ? "secondary" : "primary"} 
                onClick={() => handleLanguageChange(entry.language)}
              >
                {getLanguageFlag(entry.language)}
              </Button>
            ))}
          </Div>
        )}
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