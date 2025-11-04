import { useFlux } from '@common/hooks';
import { Css, stopEvent, toError } from 'fluxio';
import { A1, BoxController, useBoxController } from './box/BoxController';

const c = Css('EditSelect', {
  '': {
    position: 'absolute',
    pointerEvents: 'none',
    transition: 0.1,
  },
  'Border': {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    m: '-1px',
    // translateX: '-1px',
    // translateY: '-1px',
    border: 'primary',
  },
  'Border div': {
    position: 'absolute',
    wh: '9px',
    m: '-5px',
    border: 'secondary',
    bg: 'b0',
    pointerEvents: 'all',
  },
  Center: { t: '50%', l: '50%', borderRadius: '50%', cursor: 'move' },
  A: { t: 0, l: '50%', cursor: 'n-resize' },
  B: { t: 0, r: 0, cursor: 'ne-resize' },
  C: { t: '50%', r: 0, cursor: 'e-resize' },
  D: { b: 0, r: 0, cursor: 'se-resize' },
  E: { b: 0, l: '50%', cursor: 'n-resize' },
  F: { b: 0, l: 0, cursor: 'ne-resize' },
  G: { t: '50%', l: 0, cursor: 'e-resize' },
  H: { t: 0, l: 0, cursor: 'se-resize' },
});

const die = (message: string) => {
  throw toError(message);
}

const getOnResize = (ctrl: BoxController, aX: A1, aY: A1, aW: A1, aH: A1) => (event: Event) => {
  try {
    console.debug('getOnResize', { ctrl, aX, aY, aW, aH, event });
    stopEvent(event);

    const id = ctrl.click$.get().id! || die('no id');
    const box = ctrl.get(id) || die('no box');
    const el = ctrl.getEl(id) || die('no el');

    const parent = 

    const elStyle = getComputedStyleCache(el);
    if (!elStyle) return null;

    const parentStyle = getComputedStyleCache(el.parentElement);
    if (!parentStyle) return null;

    const isAbsolute =
      elStyle.position === 'absolute' &&
      (parentStyle.position === 'absolute' || parentStyle.position === 'relative');

    const ratio = 1 / zoom$.get();
    let ratioX = ratio; //-100 / (testRect.x - elRect.x);
    let ratioY = ratio; //-100 / (testRect.y - elRect.y);
    let ratioW = ratio; //-100 / (testRect.width - elRect.width);
    let ratioH = ratio; //-100 / (testRect.height - elRect.height);

    // const elRect = el.getBoundingClientRect();
    const pRect = el.parentElement.getBoundingClientRect();

    const [initX] = unitDecompose(elStyle.left);
    const [initY] = unitDecompose(elStyle.top);
    const [initW] = unitDecompose(elStyle.width);
    const [initH] = unitDecompose(elStyle.height);

    const [parentWidth] = unitDecompose(parentStyle.width);
    const [parentHeight] = unitDecompose(parentStyle.height);

    // const initX = elRect.x - pRect.x;
    // const initY = elRect.x - pRect.x;
    // const initW = elRect.width;
    // const initH = elRect.height;

    const typeX = el.style.left.includes('px') ? 'px' : '%';
    const typeY = el.style.top.includes('px') ? 'px' : '%';
    const typeW = el.style.width.includes('px') ? 'px' : '%';
    const typeH = el.style.height.includes('px') ? 'px' : '%';

    // const test = document.createElement('div');
    // test.style.position = 'absolute';
    // test.style.opacity = '0';
    // test.style.left = '100' + typeX;
    // test.style.top = '100' + typeY;
    // test.style.width = '100' + typeW;
    // test.style.height = '100' + typeH;
    // el.parentElement.appendChild(test);
    // const testRect = test.getBoundingClientRect();
    // test.remove();

    console.debug('onMove init', {
      init: [initX, initY, initW, initH],
      ratio: [ratioX, ratioY, ratioW, ratioH],
      type: [typeX, typeY, typeW, typeH],
    });

    this.onPointerDown(
      e,
      (mX, mY) => {
        const x = toUnit(initX + mX * ratioX * aX, '%', parentWidth); // typeX,
        const y = toUnit(initY + mY * ratioY * aY, '%', parentHeight); // typeY,
        const w = toUnit(initW + mX * ratioW * aW, '%', parentWidth); // typeW,
        const h = toUnit(initH + mY * ratioH * aH, '%', parentHeight); // typeH,
        if (isAbsolute) {
          if (aX !== 0) el.style.left = x;
          if (aY !== 0) el.style.top = y;
          if (aW !== 0) el.style.width = w;
          if (aH !== 0) el.style.height = h;
        } else {
          if (aW !== 0) el.style.width = w;
          if (aH !== 0) el.style.height = h;
        }
        console.debug('onMove move', x, y, w, h);
      },
      () => {
        const s = el.style;
        if (isAbsolute) {
          b.updateStyle({
            left: s.left,
            top: s.top,
            width: s.width,
            height: s.height,
          });
        } else {
          b.updateStyle({
            width: s.width,
            height: s.height,
          });
        }
      }
    );
  }
  catch (error) {
    console.error('getOnResize', { ctrl, aX, aY, aW, aH, event }, error);
  }
}

export const EditSelectBorder = ({ ctrl }: { ctrl: BoxController }) => (
  <div {...c('Border')}>
    <div {...c('Center')} onMouseDown={getOnResize(ctrl, 1, 1, 0, 0)} />
    <div {...c('A')} onMouseDown={getOnResize(ctrl, 0, 1, 0, -1)} />
    <div {...c('B')} onMouseDown={getOnResize(ctrl, 0, 1, 1, -1)} />
    <div {...c('C')} onMouseDown={getOnResize(ctrl, 0, 0, 1, 0)} />
    <div {...c('D')} onMouseDown={getOnResize(ctrl, 0, 0, 1, 1)} />
    <div {...c('E')} onMouseDown={getOnResize(ctrl, 0, 0, 0, 1)} />
    <div {...c('F')} onMouseDown={getOnResize(ctrl, 1, 0, -1, 1)} />
    <div {...c('G')} onMouseDown={getOnResize(ctrl, 1, 0, -1, 0)} />
    <div {...c('H')} onMouseDown={getOnResize(ctrl, 1, 1, -1, -1)} />
  </div>
);

export const EditSelect = () => {
  const ctrl = useBoxController()!;
  const select = useFlux(ctrl.click$);
  const panZoom = useFlux(ctrl.panZoom$);

  useFlux(panZoom?.changed$);

  console.debug('EditSelect', panZoom, select);

  if (!panZoom) return null;
  if (!select) return null;

  const { element, count } = select;

  if (!element) return null;
  if (!count) return null;

  let { left, top, width, height } = element.getBoundingClientRect();
  const containerRect = panZoom.container.getBoundingClientRect();
  left -= containerRect.left;
  top -= containerRect.top;

  return (
    <div {...c()} style={{ left, top, width, height }}>
      <EditSelectBorder ctrl={ctrl} />
    </div>
  );
};
