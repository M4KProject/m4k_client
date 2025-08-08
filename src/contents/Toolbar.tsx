import { useCss } from '@common/hooks';
import { Css } from '@common/helpers';
import { Button, Div } from '@common/components';
import { MdFitScreen, MdZoomIn, MdZoomOut, MdNavigateBefore, MdNavigateNext } from 'react-icons/md';

const css: Css = {
  '&': {
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

interface ToolbarProps {
  currentPage: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitWidth: () => void;
}

export const Toolbar = ({
  currentPage,
  totalPages,
  onPreviousPage,
  onNextPage,
  onZoomIn,
  onZoomOut,
  onFitWidth
}: ToolbarProps) => {
  const c = useCss('Toolbar', css);
  
  return (
    <Div cls={`${c}`}>
      <Button 
        icon={<MdNavigateBefore />} 
        color={currentPage <= 1 ? "secondary" : "primary"} 
        onClick={currentPage <= 1 ? undefined : onPreviousPage}
      />
      <Div cls={`${c}PageInfo`}>
        {currentPage} / {totalPages}
      </Div>
      <Button 
        icon={<MdNavigateNext />} 
        color={currentPage >= totalPages ? "secondary" : "primary"} 
        onClick={currentPage >= totalPages ? undefined : onNextPage}
      />
      <Button 
        icon={<MdZoomOut />} 
        color="primary" 
        onClick={onZoomOut} 
      />
      <Button 
        icon={<MdZoomIn />} 
        color="primary" 
        onClick={onZoomIn} 
      />
      <Button 
        icon={<MdFitScreen />} 
        color="primary" 
        onClick={onFitWidth} 
      />
    </Div>
  );
};