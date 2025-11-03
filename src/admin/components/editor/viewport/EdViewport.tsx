import { Css } from 'fluxio';
import { EdViewportPan } from './EdViewportPan';
import { EdSelect } from './EdSelect';
import { BEditorController } from '../BEditorController';
import { logger } from 'fluxio';
import { useBEditorController } from '../hooks/useBEditorController';

// function AddInIcon(props: any) {
//   return <AddToPhotosTwoTone {...props} style={{ transform: 'rotate(90deg)' }} />;
// }

const c = Css('EdViewport', {
  '': {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
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

const log = logger('EdViewport');

export const EdViewport = () => {
  log.d('render');

  const controller = useBEditorController();

  return (
    <div
      {...c()}
      onMouseDown={(e) => {
        log.d('onMouseDown', e);

        const el = e.target as HTMLDivElement;
        if (!el) return;

        // if (typeof el.className !== 'string') return;
        // if (!el.className.includes('EdViewport') && el.id !== 'root') return;

        const init = { ...controller.viewport$.get() };
        controller.onPointerDown(e, (x, y) => {
          this.viewport$.set({
            ...init,
            x: init.x + x,
            y: init.y + y,
          });
        });
      }}
    >
      <EdViewportPan />
      <EdSelect />
    </div>
  );
};
