import { Css } from '@common/ui';
import { Button } from '@common/components';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const c = Css('PDFToolbar', {
  '': {
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
  PageInfo: {
    bold: 1,
    color: '#333',
    padding: '0 10px',
    whiteSpace: 'nowrap',
  },
  ' .Button-primary': {
    bg: '#7a624a',
  },
  ' .Button-primary .ButtonIcon': {
    fg: '#7a624a',
  },
  ' .Button-secondary': {
    bg: '#5a5a5a',
  },
  ' .Button-secondary .ButtonIcon': {
    fg: '#5a5a5a',
  },
});

interface PDFToolbarProps {
  currentPage: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitWidth: () => void;
}

export const PDFToolbar = ({
  currentPage,
  totalPages,
  onPreviousPage,
  onNextPage,
  onZoomIn,
  onZoomOut,
  onFitWidth,
}: PDFToolbarProps) => {
  return (
    <div class={c()}>
      <Button
        icon={<ChevronLeft />}
        color={currentPage <= 1 ? 'secondary' : 'primary'}
        onClick={currentPage <= 1 ? undefined : onPreviousPage}
      />
      <div class={c('PageInfo')}>
        {currentPage} / {totalPages}
      </div>
      <Button
        icon={<ChevronRight />}
        color={currentPage >= totalPages ? 'secondary' : 'primary'}
        onClick={currentPage >= totalPages ? undefined : onNextPage}
      />
      {/* <Button 
        icon={<ZoomOut />} 
        color="primary" 
        onClick={onZoomOut} 
      />
      <Button 
        icon={<ZoomIn />} 
        color="primary" 
        onClick={onZoomIn} 
      />
      <Button 
        icon={<Maximize />} 
        color="primary" 
        onClick={onFitWidth} 
      /> */}
    </div>
  );
};
