import { useFlux } from '@common/hooks';
import { Css } from 'fluxio';
import { CopyPlus, Eye } from 'lucide-react';
import { moveAndResize, onClick, onDuplicate, onMove } from './helpers';
import { B } from '../B';
import { useBEditorController } from '../hooks/useBEditorController';
import { AddOne } from '../BEditorController';

const c = Css('EdSelect', {
  '': {
    position: 'absolute',
    xy: '-5px',
    wh: 0,
    border: '2px solid #1976d2',
    pointerEvents: 'none',
  },
  ' div': {
    position: 'absolute',
    wh: '9px',
    m: '-5px',
    border: '2px solid #9c27b0',
    background: '#FFFFFF',
    pointerEvents: 'all',
  },
  T: { top: 0, left: '50%', cursor: 'n-resize' },
  B: { bottom: 0, left: '50%', cursor: 'n-resize' },
  R: { top: '50%', right: 0, cursor: 'e-resize' },
  L: { top: '50%', left: 0, cursor: 'e-resize' },
  C: { top: '50%', left: '50%', borderRadius: '50%', cursor: 'move' },
  TR: { top: 0, right: 0, cursor: 'ne-resize' },
  TL: { top: 0, left: 0, cursor: 'se-resize' },
  BR: { bottom: 0, right: 0, cursor: 'se-resize' },
  BL: { bottom: 0, left: 0, cursor: 'ne-resize' },

  Actions: {
    b: -20,
    r: 0,
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    m: 0,
    border: 0,
    bg: 'none',
    h: 18,
    w: '100%',
  },
  Action: {
    position: 'relative',
    cursor: 'pointer',
    border: '0',
    background: 'none',
    margin: 0,
    width: '18px',
    height: '18px',
    color: '#9c27b0',
  },
});

export const EdResizes = () => {
  const controller = useBEditorController();

  const getMouseDown = (aX: AddOne, aY: AddOne, aW: AddOne, aH: AddOne) => (e: Event) =>
    controller.onMoveOrResize(e, aX, aY, aW, aH);

  return (
    <>
      <div {...c('T')} onMouseDown={getMouseDown(0, 1, 0, -1)} />
      <div {...c('B')} onMouseDown={getMouseDown(0, 0, 0, 1)} />
      <div {...c('R')} onMouseDown={getMouseDown(0, 0, 1, 0)} />
      <div {...c('L')} onMouseDown={getMouseDown(1, 0, -1, 0)} />
      <div {...c('C')} onMouseDown={getMouseDown(1, 1, 0, 0)} />
      <div {...c('TR')} onMouseDown={getMouseDown(0, 1, 1, -1)} />
      <div {...c('TL')} onMouseDown={getMouseDown(1, 1, -1, -1)} />
      <div {...c('BR')} onMouseDown={getMouseDown(0, 0, 1, 1)} />
      <div {...c('BL')} onMouseDown={getMouseDown(1, 0, -1, 1)} />
    </>
  );
};

export const EdActions = () => (
  <div {...c('Actions')}>
    <div {...c('Action')} onMouseDown={onDuplicate}>
      <CopyPlus />
    </div>
    <div {...c('Action')} onMouseDown={onClick}>
      <Eye />
    </div>
  </div>
);

export const EdSelect = () => {
  console.debug('EdSelect');

  const controller = useBEditorController();
  const { scale, w, h, x, y } = useFlux(controller.viewport$);

  const b = useFlux(B.select$);
  const el = b?.el;
  if (!el) return <div {...c()} />;

  const rect = el.getBoundingClientRect();
  let { left, top, width, height } = rect;
  left -= 1;
  top -= 1;
  width += 2;
  height += 2;

  // const computedStyle = getComputedStyleCache(el);
  // const isAbsolute = computedStyle && computedStyle.position === 'absolute';

  return (
    <div {...c()} style={{ left, top, width, height }}>
      <EdResizes />
      <EdActions />
    </div>
  );
};
