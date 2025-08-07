import { useAsyncEffect, useCss } from '@common/hooks';
import { addJsFileAsync, Css, flexColumn, global } from '@common/helpers';
import { Button, Div } from '@common/components';
import { useRef, useState } from 'preact/hooks';
import { MdSquare, MdZoomIn, MdZoomOut } from 'react-icons/md';
import { mediaColl, MediaModel } from '@common/api';

const css: Css = {
  '&': {
    ...flexColumn({ align: 'center', justify: 'center' }),
    minHeight: '100vh',
    p: 2,
  },
  '&Tools': {
    display: 'flex',
    gap: '1rem',
    mb: 2,
  },
  '&Container': {
    width: '100%',
    height: '100%',
    maxWidth: '100%',
    overflow: 'auto',
    textAlign: 'center',
  },
};

export const PDFViewer = ({ media }: { media: MediaModel }) => {
  const c = useCss('PDFViewer', css);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1.0);
  const [pdfDoc, setPdfDoc] = useState<any>(null);

  const renderPage = async (scale: number) => {
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
    setScale(newScale);
    renderPage(newScale);
  };

  const handleZoomOut = () => {
    const newScale = Math.max(0.2, scale - 0.2);
    setScale(newScale);
    renderPage(newScale);
  };

  const handleFitWidth = () => {
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
    if (!containerEl) return;

    await addJsFileAsync("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js");

    // Assure-toi que pdfjsLib est bien disponible globalement
    const pdfjsLib = global.pdfjsLib;
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    const pdfUrl = await mediaColl.getUrl(media.id);
    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;

    setPdfDoc(pdf);

    const canvas = document.createElement('canvas');
    canvasRef.current = canvas;
    containerEl.innerHTML = '';
    containerEl.appendChild(canvas);

    renderPage(scale);
  }, [media]);

  return (
    <Div cls={`${c}`}>
      <Div cls={`${c}Tools`}>
        <Button icon={<MdZoomIn />} color="primary" onClick={handleZoomIn} />
        <Button icon={<MdZoomOut />} color="primary" onClick={handleZoomOut} />
        <Button icon={<MdSquare />} color="primary" onClick={handleFitWidth} />
      </Div>
      <Div cls={`${c}Container`} ref={containerRef} />
    </Div>
  );
};