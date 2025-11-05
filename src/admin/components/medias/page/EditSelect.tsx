import { useFlux, useFluxState } from '@common/hooks';
import { Css, CssStyle, Dictionary, flux, fluxCombine, fluxEvent, getEventXY, isDeepEqual, onHtmlEvent, round, stopEvent, toError, toNumber, XY } from 'fluxio';
import { A1, BoxController, useBoxController } from './box/BoxController';
import { useEffect, useMemo, useState } from 'preact/hooks';

const c = Css('EditSelect', {
  '': {
    position: 'absolute',
    pointerEvents: 'none',
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
  // Center: { t: '50%', l: '50%', borderRadius: '50%', cursor: 'move' },
  // A: { t: 0, l: '50%', cursor: 'n-resize' },
  // B: { t: 0, r: 0, cursor: 'ne-resize' },
  // C: { t: '50%', r: 0, cursor: 'e-resize' },
  // D: { b: 0, r: 0, cursor: 'se-resize' },
  // E: { b: 0, l: '50%', cursor: 'n-resize' },
  // F: { b: 0, l: 0, cursor: 'ne-resize' },
  // G: { t: '50%', l: 0, cursor: 'e-resize' },
  // H: { t: 0, l: 0, cursor: 'se-resize' },
});

type UnitType = 'rem' | 'em' | 'px' | '%';

const unitDecompose = (unit: string): [number, UnitType] => {
  const m = unit.match(/([0-9\.]+) ?([a-z%]+)/);
  return m ? [toNumber(m[1], 0), (m[2] as any) || 'px'] : [0, 'px'];
};

const onResize = (ctrl: BoxController, aX: A1, aY: A1, aW: A1, aH: A1) => (event: Event) => {
  try {
    console.debug('getOnResize', { ctrl, aX, aY, aW, aH, event });
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
      const x = toPrct(x0 + eX * ratio * aX, pWidth);
      const y = toPrct(y0 + eY * ratio * aY, pHeight);
      const w = toPrct(w0 + eX * ratio * aW, pWidth);
      const h = toPrct(h0 + eY * ratio * aH, pHeight);

      ctrl.update(id, { pos: [x, y, w, h] });
    }

    const onEnd = (event: Event) => {
      onMove(event);
      for (const off of offs) off();
    }

    const offs = [
      onHtmlEvent(0, 'mousemove', onMove),
      onHtmlEvent(0, 'mouseup', onEnd),
      onHtmlEvent(0, 'touchmove', onMove),
      onHtmlEvent(0, 'touchend', onEnd),
    ];
  }
  catch (error) {
    console.error('getOnResize', { ctrl, aX, aY, aW, aH, event }, error);
  }
}

export const EditSelectBorder = ({ ctrl }: { ctrl: BoxController }) => {
  const H = 0.5;
  const N = -1;
  type Pos = 0|0.5|1;
  type Move = 0|1;
  type Resize = -1|0|1;
  const resizes: [Pos, Pos, Move, Move, Resize, Resize, string, string, CssStyle][] = [
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
      {resizes.map(([left, top, mX, mY, rW, rH, cursor, arrow, style], i) => (
        <div
          key={i}
          style={{
            left: (left*100) + '%',
            top: (top*100) + '%',
            cursor,
            ...style,
          }}
          onMouseDown={() => onResize(ctrl, mX, mY, rW, rH)}
        />
      ))}
    </div>
  );
};

export const EditSelect = () => {
  const ctrl = useBoxController();
  const panZoom = useFlux(ctrl.panZoom$);
  const [style, setStyle] = useState<CssStyle|undefined>(undefined);

  useEffect(() => {
    if (!ctrl) return;
    if (!panZoom) return;

    const set = (next: CssStyle|undefined) =>
      setStyle(prev => isDeepEqual(prev, next) ? prev : next);

    return fluxCombine(
      ctrl.click$,
      panZoom.after$,
      panZoom.after$.delay(100),
    )
      .throttle(1000 / 60)
      .on(([click]) => {
        const { element, box, count } = click||{};
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

  return style ? (
    <div {...c()} style={style}>
      <EditSelectBorder ctrl={ctrl} />
    </div>
  ) : null;
};
