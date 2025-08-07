import { useAsyncEffect, useCss } from '@common/hooks';
import { addJsFileAsync, Css, flexColumn, global } from '@common/helpers';
import { Button, Div } from '@common/components';
import { useRef, useState } from 'preact/hooks';
import { MdSquare, MdZoomIn, MdZoomOut } from 'react-icons/md';

const css: Css = {
  '&': {
    ...flexColumn({ align: 'stretch', justify: 'stretch' }),
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
  '&Tools': {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '1rem',
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
};

export const PDFViewer = ({ url }: { url: string }) => {
  const c = useCss('PDFViewer', css);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1.0);
  const [pdfDoc, setPdfDoc] = useState<any>(null);

  const renderPage = async (scale: number) => {
    console.debug('PDFViewer renderPage', url, scale);

    if (!pdfDoc || !canvasRef.current) return;

    const page = await pdfDoc.getPage(1);
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

    const page = pdfDoc.getPage(1);
    page.then((p: any) => {
      const viewport = p.getViewport({ scale: 1 });
      const containerWidth = containerRef.current!.offsetWidth;
      const fitScale = containerWidth / viewport.width;

      setScale(fitScale);
      renderPage(fitScale);
    });
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

    // Set pdfDoc and render after canvas is attached
    setPdfDoc(pdf);
    
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
  }, [url]);

  console.debug('PDFViewer', { url });

  return (
    <Div cls={`${c}`}>
      <div className={`${c}Container`} ref={containerRef} />
      <Div cls={`${c}Tools`}>
        <Button icon={<MdZoomIn />} color="primary" onClick={handleZoomIn} />
        <Button icon={<MdZoomOut />} color="primary" onClick={handleZoomOut} />
        <Button icon={<MdSquare />} color="primary" onClick={handleFitWidth} />
      </Div>
    </Div>
  );
};