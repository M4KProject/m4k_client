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

type EditHandleConfig = [M, M, R, R];
type EditHandleStyleCompressed = [P, P, string] | [P, P, string, CssStyle];

const compressed: [string, EditHandleConfig, EditHandleStyleCompressed][] = [
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

const handles: [string, EditHandleConfig, CssStyle][] = compressed.map(
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

const startResize = (ctrl: BoxCtrl, config: EditHandleConfig, name: string, event: Event) => {
  try {
    console.debug('startResize', config, name, event);
    stopEvent(event);

    const id = mustExist(ctrl.click$.get()?.id, 'id');
    const box = mustExist(ctrl.get(id), 'box');
    const pos = mustExist(box.pos, 'pos');

    const ratio = 1 / ctrl.panZoom.scale;
    console.debug('startResize ratio', ratio);

    const [xRatio, yRatio, wRatio, hRatio] = config.map((v) => v * ratio) as typeof config;

    const canvasRect = ctrl.panZoom.canvasRect();
    const canvasW = canvasRect.width;
    const canvasH = canvasRect.height;

    // ctrl.findParent(id, )
    // ctrl.findChildren(id, )
    // const parentType = parent.type || '';
    // if (['carousel', 'pdf'].includes(parentType)) {
    //   startResize(ctrl, config, name, event, parentId);
    //   return;
    // }

    const [startEventX, startEventY] = mustExist(getEventXY(event), 'startEventXY');
    const [x0, y0, w0, h0] = pos;
    console.debug('startResize pos', pos);

    const getVal = (v: number, size: number) => {
      v = 100 * (v / size);
      const snap = 48 / 100;
      v = round(v * snap) / snap;
      v = round(v, 3);
      return v;
    };

    const onMove = (event: Event) => {
      const [eventX, eventY] = mustExist(getEventXY(event), 'eventXY');
      const xDelta = eventX - startEventX;
      const yDelta = eventY - startEventY;
      const x = getVal(x0 + xDelta * xRatio, canvasW);
      const y = getVal(y0 + yDelta * yRatio, canvasH);
      const w = getVal(w0 + xDelta * wRatio, canvasW);
      const h = getVal(h0 + yDelta * hRatio, canvasH);
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
    console.error('startResize', config, name, event, error);
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
        const { element, box, count } = click || {};
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
  }, [ctrl, el, setStyle]);

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
