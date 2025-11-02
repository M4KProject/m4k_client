import { add, addIn, exportData, importData, getSelect, setSelect } from './bEdit';
import { B, BElement } from './B';
import { panel$, pos$, screenPos$, screenSize$, zoom$ } from './flux';
import { deepClone, toNumber } from 'fluxio';
import { useEffect, useRef } from 'preact/hooks';
import { useFlux } from '@common/hooks';
import { Css } from '@common/ui';
import { EdViewportPan } from './EdViewportPan';
import { EdSelect } from './EdSelect';

// function AddInIcon(props: any) {
//   return <AddToPhotosTwoTone {...props} style={{ transform: 'rotate(90deg)' }} />;
// }

const onViewportMouseDown = (e: any) => {
  console.debug('onViewportMouseDown', e);

  const el: HTMLDivElement = e.target;
  if (!el) return;
  if (typeof el.className !== 'string') return;
  if (!el.className.includes('EdViewport') && el.id !== 'root') return;

  const init = { ...screenPos$.get() };
  mouseDown(e, (x, y) => {
    screenPos$.set({
      x: init.x + x,
      y: init.y + y,
    });
  });
};

const c = Css('EdViewport', {
  '': {
    position: 'relative',
    overflow: 'hidden',
    flex: 1,
    background: '#000',
  },
  // '[contenteditable="true"]': {
  //   outline: '0px solid transparent',
  //   caretColor: '#0000FF',
  // },
  // '& .price-0': {
  //   visibility: 'visible',
  //   opacity: 0.1,
  // },
  // '& .EdSelect': {
  // },
  // '& .EdSelect div': {
  //   position: 'absolute',
  //   width: '9px',
  //   height: '9px',
  //   margin: '-5px',
  //   border: '2px solid #9c27b0',
  //   background: '#FFFFFF',
  //   pointerEvents: 'all',
  // },
  // '& .EdSelect_T': { top: 0, left: '50%', cursor: 'n-resize' },
  // '& .EdSelect_B': { bottom: 0, left: '50%', cursor: 'n-resize' },
  // '& .EdSelect_R': { top: '50%', right: 0, cursor: 'e-resize' },
  // '& .EdSelect_L': { top: '50%', left: 0, cursor: 'e-resize' },
  // '& .EdSelect_C': { top: '50%', left: '50%', borderRadius: '50%', cursor: 'move' },
  // '& .EdSelect_TR': { top: 0, right: 0, cursor: 'ne-resize' },
  // '& .EdSelect_TL': { top: 0, left: 0, cursor: 'se-resize' },
  // '& .EdSelect_BR': { bottom: 0, right: 0, cursor: 'se-resize' },
  // '& .EdSelect_BL': { bottom: 0, left: 0, cursor: 'ne-resize' },

  // '& .EdSelect .EdActions': {
  //   bottom: -20,
  //   right: 0,
  //   position: 'absolute',
  //   display: 'flex',
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'flex-end',
  //   margin: 0,
  //   border: 0,
  //   background: 'none',
  //   height: 18,
  //   width: '100%',
  // },

  // '& .EdSelect .EdAction': {
  //   position: 'relative',
  //   cursor: 'pointer',
  //   border: '0',
  //   background: 'none',
  //   margin: 0,
  //   width: '18px',
  //   height: '18px',
  //   color: '#9c27b0',
  //   '& .MuiSvgIcon-root': {
  //     width: '18px',
  //     height: '18px',
  //   },
  // },

  // // '& .EdAction-Duplicate': { color: '#9c27b0' },
  // // '& .EdAction-Click': { color: '#9c27b0' },

  // '& .carousel.ed-selected > .box': {
  //   visibility: 'hidden',
  //   opacity: 0,
  //   transform: 'scale(0)',
  //   zIndex: 0,
  // },
  // '& .carousel.ed-selected > .box.ed-selected': {
  //   visibility: 'visible',
  //   opacity: 1,
  //   transform: 'scale(1)',
  //   zIndex: 1,
  // },
});

export const EdViewport = () => {
  console.debug('EdViewport');

  return (
    <div {...c()} onMouseDown={onViewportMouseDown}>
      <EdViewportPan />
      <EdSelect />
    </div>
  );
}
