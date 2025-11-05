import { useFlux } from '@common/hooks';
import {
  Css,
  CssStyle,
  fluxCombine,
  getEventXY,
  isDeepEqual,
  onHtmlEvent,
  round,
  stopEvent,
  toError,
} from 'fluxio';
import { BoxController, useBoxController } from './box/BoxController';
import { useEffect, useState } from 'preact/hooks';

const c = Css('EditSelect', {
  '': {
    position: 'absolute',
    pointerEvents: 'none',
  },
  Border: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    m: '-1px',
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
});

type P = 0 | 0.5 | 1;
type M = 0 | 1;
type R = -1 | 0 | 1;

const onResize =
  (ctrl: BoxController, mX: M, mY: M, rW: R, rH: R, name: string) => (event: Event) => {
    try {
      console.debug('onResize', name, { ctrl, mX, mY, rW, rH, event });
      stopEvent(event);

      const panZoom = ctrl.panZoom$.get();
      if (!panZoom) throw toError('no panZoom');

      const select = ctrl.click$.get();
      if (!select) throw toError('no select');

      const { id, box, element } = select;
      if (!id) throw toError('no id');
      if (!box) throw toError('no box');
      if (!element) throw toError('no element');

      const parent = element.parentElement;
      if (!parent) throw toError('no parent');

      const pos = box.pos;
      if (!pos) throw toError('no pos');

      const pRect = parent.getBoundingClientRect();
      const pWidth = pRect.width;
      const pHeight = pRect.height;
      const [x0, y0, w0, h0] = pos;
      const ratio = 1 / panZoom.scale;

      console.debug('getOnResize init', x0, y0, w0, h0, ratio);

      const toPrct = (v: number, size: number) => {
        v = 100 * (v / size);
        const snap = 48 / 100;
        v = round(v * snap) / snap;
        v = round(v, 3);
        return v;
      };

      const onMove = (e: Event) => {
        const eventXY = getEventXY(e);
        if (!eventXY) return;

        const [eX, eY] = eventXY;
        const x = toPrct(x0 + eX * ratio * mX, pWidth);
        const y = toPrct(y0 + eY * ratio * mY, pHeight);
        const w = toPrct(w0 + eX * ratio * rW, pWidth);
        const h = toPrct(h0 + eY * ratio * rH, pHeight);

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
      console.error('getOnResize', { ctrl, mX, mY, rW, rH, event }, error);
    }
  };

export const EditSelectBorder = ({ ctrl }: { ctrl: BoxController }) => {
  const H = 0.5;
  const N = -1;
  const resizes: [P, P, M, M, R, R, string, string, CssStyle][] = [
    [H, 0, 0, 1, 0, N, 'n-resize', '↑', {}],
    [1, 0, 0, 1, 1, N, 'ne-resize', '↗', {}],
    [1, H, 0, 0, 1, 0, 'e-resize', '→', {}],
    [1, 1, 0, 0, 1, 1, 'se-resize', '↘', {}],
    [H, 1, 0, 0, 0, 1, 'n-resize', '↓', {}],
    [0, 1, 1, 0, N, 1, 'ne-resize', '↙', {}],
    [0, H, 1, 0, N, 0, 'e-resize', '←', {}],
    [0, 0, 1, 1, N, N, 'se-resize', '↖', {}],
    [H, H, 1, 1, 0, 0, 'move', '●', { borderRadius: '50%' }],
  ];
  return (
    <div {...c('Border')}>
      {resizes.map(([left, top, mX, mY, rW, rH, cursor, name, style], i) => (
        <div
          key={i}
          style={{
            left: left * 100 + '%',
            top: top * 100 + '%',
            cursor,
            ...style,
          }}
          onMouseDown={() => onResize(ctrl, mX, mY, rW, rH, name)}
        />
      ))}
    </div>
  );
};

export const EditSelect = () => {
  const ctrl = useBoxController();
  const panZoom = useFlux(ctrl.panZoom$);
  const [style, setStyle] = useState<CssStyle | undefined>(undefined);

  useEffect(() => {
    if (!ctrl) return;
    if (!panZoom) return;

    const set = (next: CssStyle | undefined) =>
      setStyle((prev) => (isDeepEqual(prev, next) ? prev : next));

    return fluxCombine(ctrl.click$, panZoom.after$, panZoom.after$.delay(100))
      .throttle(1000 / 60)
      .on(([click]) => {
        const { element, box, count } = click || {};
        if (!element || !box) return set(undefined);

        const { left, top, width, height } = element.getBoundingClientRect();
        const next = { left, top, width, height };

        const containerRect = panZoom.container.getBoundingClientRect();
        next.left -= containerRect.left;
        next.top -= containerRect.top;

        set(next);
      });
  }, [ctrl, panZoom]);

  console.debug('EditSelect render', style);

  return style ?
      <div {...c()} style={style}>
        <EditSelectBorder ctrl={ctrl} />
      </div>
    : null;
};
