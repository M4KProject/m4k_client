import { useAsyncEffect, useCss } from '@common/hooks';
import { addJsFileAsync, Css, flexColumn, global } from '@common/helpers';
import { Button, Div } from '@common/components';
import { useRef } from 'preact/hooks';
import { MdSquare, MdZoomIn, MdZoomOut } from 'react-icons/md';
import { mediaColl, MediaModel } from '@common/api';

const css: Css = {
  '&': {
    ...flexColumn({ align: 'center', justify: 'center' }),
    minHeight: '100vh',
    p: 2,
  },
  '&Message': {
    fontSize: 1.2,
    color: '#666',
    textAlign: 'center',
  }
};

export const PDFViewer = ({ media }: { media: MediaModel }) => {
  const c = useCss('PDFViewer', css);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => {

  }

  const handleZoomOut = () => {
    
  }

  const handleFitWidth = () => {
    
  }

  useAsyncEffect(async () => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    await addJsFileAsync("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js");
    global.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    const pdfUrl = await mediaColl.getUrl(media.id);
    

  }, [containerRef, media]);
  
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
