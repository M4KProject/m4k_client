import {
  Css,
  CssStyle,
  fluxCombine,
  getEventXY,
  mustExist,
  onHtmlEvent,
  round,
  setStyle,
  stopEvent,
} from 'fluxio';
import { BoxCtrl, useBoxCtrl } from './box/BoxCtrl';
import { useEffect, useRef } from 'preact/hooks';

const c = Css('EditHandles', {
  '': {
    display: 'none',
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    m: '-1px',
    border: 'primary',
  },
  ' div': {
    position: 'absolute',
    wh: '9px',
    m: '-5px',
    border: 'secondary',
    bg: 'b0',
    pointerEvents: 'all',
  },
});

type P = 0 | 0.5 | 1;
type M = 0 | 1;
type R = -1 | 0 | 1;

const H: P = 0.5;
const N: R = -1;

type HandleDir = [M, M, R, R];
type HandleStyle = [P, P, string] | [P, P, string, CssStyle];

const compressed: [string, HandleDir, HandleStyle][] = [
  ['●', [1, 1, 0, 0], [H, H, 'move', { borderRadius: 99 }]],
  ['↑', [0, 1, 0, N], [H, 0, 'n-resize']],
  ['↗', [0, 1, 1, N], [1, 0, 'ne-resize']],
  ['→', [0, 0, 1, 0], [1, H, 'e-resize']],
  ['↘', [0, 0, 1, 1], [1, 1, 'se-resize']],
  ['↓', [0, 0, 0, 1], [H, 1, 'n-resize']],
  ['↙', [1, 0, N, 1], [0, 1, 'ne-resize']],
  ['←', [1, 0, N, 0], [0, H, 'e-resize']],
  ['↖', [1, 1, N, N], [0, 0, 'se-resize']],
];

const handles: [string, HandleDir, CssStyle][] = compressed.map(
  ([name, config, [l, r, cursor, style]]) => [
    name,
    config,
    {
      cursor,
      left: `${l * 100}%`,
      top: `${r * 100}%`,
      ...style,
    },
  ]
);

const startResize = (ctrl: BoxCtrl, dir: HandleDir, name: string, event: Event) => {
  try {
    console.debug('startResize', dir, name, event);
    stopEvent(event);

    const id = mustExist(ctrl.click$.get()?.id, 'id');
    const box = mustExist(ctrl.get(id), 'box');
    const pos = mustExist(box.pos, 'pos');

    const ratio = 1 / ctrl.panZoom.scale;
    console.debug('startResize ratio', ratio);

    const [xDir, yDir, wDir, hDir] = dir;

    const canvasRect = ctrl.panZoom.canvasRect();
    const canvasW = canvasRect.width;
    const canvasH = canvasRect.height;

    const snap = (v: number) => {
      const snapFactor = 48 / 100;
      v = round(v * snapFactor) / snapFactor;
      v = round(v, 3);
      return v;
    };

    const prctToPxX = (prct: number) => (prct * canvasW) / 100;
    const prctToPxY = (prct: number) => (prct * canvasH) / 100;
    const pxToPrctX = (px: number) => snap((px * 100) / canvasW);
    const pxToPrctY = (px: number) => snap((px * 100) / canvasH);

    const [startEventX, startEventY] = mustExist(getEventXY(event), 'startEventXY');
    
    const x0 = prctToPxX(pos[0]);
    const y0 = prctToPxY(pos[1]);
    const w0 = prctToPxX(pos[2]);
    const h0 = prctToPxY(pos[3]);
    
    console.debug('startResize pos', pos, [x0, y0, w0, h0]);

    const onMove = (event: Event) => {
      const [eventX, eventY] = mustExist(getEventXY(event), 'eventXY');

      const deltaX = (eventX - startEventX) * ratio;
      const deltaY = (eventY - startEventY) * ratio;

      const xPx = x0 + deltaX * xDir;
      const yPx = y0 + deltaY * yDir;
      const wPx = w0 + deltaX * wDir;
      const hPx = h0 + deltaY * hDir;

      const x = pxToPrctX(xPx);
      const y = pxToPrctY(yPx);
      const w = pxToPrctX(wPx);
      const h = pxToPrctY(hPx);

      ctrl.update(id, { pos: [x, y, w, h] });
    };

    const onEnd = (event: Event) => {
      onMove(event);
      for (const off of offs) off();
    };

    const offs = [
      onHtmlEvent(0, 'mousemove', onMove),
      onHtmlEvent(0, 'mouseup', onEnd),
      onHtmlEvent(0, 'touchmove', onMove),
      onHtmlEvent(0, 'touchend', onEnd),
    ];
  } catch (error) {
    console.error('startResize', dir, name, event, error);
  }
};

export const EditHandles = () => {
  const ctrl = useBoxCtrl();
  const ref = useRef<HTMLDivElement>(null);
  const el = ref.current;
  ctrl.handlesEl = el;

  useEffect(() => {
    if (!ctrl) return;
    if (!el) return;

    return fluxCombine(ctrl.click$, ctrl.boxes, ctrl.panZoom.after$, ctrl.panZoom.after$.delay(100))
      .throttle(1000 / 60)
      .on(([click]) => {
        const { element, box } = click || {};
        if (!element || !box) {
          setStyle(el, { display: 'none' });
          return;
        }

        let { left, top, width, height } = element.getBoundingClientRect();

        const viewportRect = ctrl.panZoom.viewportRect();
        left -= viewportRect.left;
        top -= viewportRect.top;

        setStyle(el, {
          display: 'block',
          left: left + 'px',
          top: top + 'px',
          width: width + 'px',
          height: height + 'px',
        });
      });
  }, [ctrl, el]);

  console.debug('EditHandles render', ctrl, el);

  return (
    <div ref={ref} {...c()}>
      {handles.map(([name, config, style]) => (
        <div
          key={name}
          style={style as any}
          onMouseDown={(event) => startResize(ctrl, config, name, event)}
        />
      ))}
    </div>
  );
};
