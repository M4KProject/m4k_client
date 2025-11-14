import {
  Css,
  CssStyle,
  fluxCombine,
  getEventXY,
  logger,
  mustExist,
  onHtmlEvent,
  round,
  stopEvent,
} from 'fluxio';
import { BCtrl, useBCtrl } from '@/components/box/BCtrl';
import { useFluxMemo } from '@/hooks/useFlux';

const log = logger('BHandles');

const c = Css('BHandles', {
  '': {
    display: 'none',
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    m: '-2px',
    border: 'p',
    borderWidth: '2px',
  },
  '-show': {
    display: 'block',
  },
  ' div': {
    display: 'none',
    position: 'absolute',
    wh: '10px',
    m: '-5px',
    border: 's',
    bg: 'bg',
    pointerEvents: 'all',
  },
  '-resize div': {
    display: 'block',
  }
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

const startResize = (ctrl: BCtrl, dir: HandleDir, name: string, event: Event) => {
  try {
    log.d('startResize', dir, name, event);
    stopEvent(event);

    const i = mustExist(ctrl.click$.get()?.i, 'i');
    const box = mustExist(ctrl.get(i), 'box');
    const pos = mustExist(box.pos, 'pos');

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

    log.d('startResize pos', pos, [x0, y0, w0, h0]);

    const onMove = (event: Event) => {
      const [eventX, eventY] = mustExist(getEventXY(event), 'eventXY');

      const deltaX = eventX - startEventX;
      const deltaY = eventY - startEventY;

      const xPx = x0 + deltaX * xDir;
      const yPx = y0 + deltaY * yDir;
      const wPx = w0 + deltaX * wDir;
      const hPx = h0 + deltaY * hDir;

      const x = pxToPrctX(xPx);
      const y = pxToPrctY(yPx);
      const w = pxToPrctX(wPx);
      const h = pxToPrctY(hPx);

      ctrl.update(i, { pos: [x, y, w, h] });
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

const BHandlesContent = () => {
  const ctrl = useBCtrl();
  return (
    <>
      {handles.map(([name, config, style]) => (
        <div
          key={name}
          style={style as any}
          onMouseDown={(event) => startResize(ctrl, config, name, event)}
        />
      ))}
    </>
  )
}

export const BHandles = () => {
  const ctrl = useBCtrl();
  const { x, y, w, h, pos, show } = useFluxMemo(() => {

    if (!ctrl) return;

    const combined$ = fluxCombine(
      ctrl.click$,
      ctrl.items$,
      ctrl.panZoom.after$,
      ctrl.panZoom.after$.delay(100),
    ).throttle(1000 / 60);

    return combined$.map(([click]) => {
      const { el, item } = click || {};
      if (!el || !item) return;

      let { left:x, top:y, width:w, height:h } = el.getBoundingClientRect();

      const viewportRect = ctrl.panZoom.viewportRect();
      x -= viewportRect.left;
      y -= viewportRect.top;

      const pos = ctrl.getType(item?.type).pos;

      log.d('event', x, y, w, h, pos);

      return { x, y, w, h, pos, show: true };
    });

  }, [ctrl]) || {};

  log.d('render', { x, y, w, h, pos, show });

  return (
    <div {...c('', pos && '-resize', show && '-show')} style={{
      left: x + 'px',
      top: y + 'px',
      width: w + 'px',
      height: h + 'px',
    }}>
      <BHandlesContent />
    </div>
  );
};
