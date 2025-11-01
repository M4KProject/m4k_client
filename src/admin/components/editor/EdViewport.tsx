import { add, addIn, exportData, importData, getSelect, setSelect } from './bEdit';
import B, { BElement } from './B';
import { panel$, pos$, screenPos$, screenSize$, zoom$ } from './flux';
import { deepClone, toNumber } from 'fluxio';
import { useEffect, useRef } from 'preact/hooks';
import { useFlux } from '@common/hooks';
import { Css } from '@common/ui';
import { CopyPlus, Eye } from 'lucide-react';

// function AddInIcon(props: any) {
//   return <AddToPhotosTwoTone {...props} style={{ transform: 'rotate(90deg)' }} />;
// }

const getComputedStyleCache = (() => {
  let lastEl: BElement | undefined = undefined;
  let style: CSSStyleDeclaration | undefined = undefined;
  return (el: BElement) => {
    if (lastEl !== el) {
      lastEl = el;
      style = el ? getComputedStyle(el) : undefined;
    }
    return style;
  };
})();

let ctrlKey = false;

function mouseDown(
  e: MouseEvent,
  move: (x: number, y: number) => void,
  end?: (x: number, y: number) => void
) {
  e.preventDefault();
  e.stopPropagation();
  const iX = e.clientX;
  const iY = e.clientY;
  const hMove = (e: MouseEvent) => {
    ctrlKey = !!e.ctrlKey;
    e.stopPropagation();
    move(e.clientX - iX, e.clientY - iY);
  };
  const hEnd = (e: MouseEvent) => {
    document.removeEventListener('mousemove', hMove);
    document.removeEventListener('mouseup', hEnd);
    if (end) end(e.clientX - iX, e.clientY - iY);
  };
  document.addEventListener('mousemove', hMove);
  document.addEventListener('mouseup', hEnd);
}

function onViewportMouseDown(e: any) {
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
}

type UnitType = 'rem' | 'em' | 'px' | '%';

function unitDecompose(unit: string): [number, UnitType] {
  const m = unit.match(/([0-9\.]+) ?([a-z%]+)/);
  return m ? [toNumber(m[1], 0), (m[2] as any) || 'px'] : [0, 'px'];
}

function getResizeBox(): B | null {
  const b = getSelect();
  if (!b) return null;

  if (b.parent) {
    const parentType = b.parent.d.t;
    if (parentType === 'carousel' || parentType === 'pdf') {
      setSelect(b.parent);
      return getResizeBox();
    }
  }

  return b;
}

function toUnit(v: number, type: string, size: number) {
  if (type === '%') v = 100 * (v / size);
  const snap = ctrlKey ? 100 : 48 / 100;
  v = Math.round(v * snap) / snap;
  v = Math.round(v * 1000) / 1000;
  return v + type;
}

function moveAndResize(e: any, aX: -1 | 1 | 0, aY: -1 | 1 | 0, aW: -1 | 1 | 0, aH: -1 | 1 | 0) {
  console.debug('move');
  e.stopPropagation();

  const b = getResizeBox();
  if (!b) return;

  const el = b.el;
  if (!el) return;
  if (!el.parentElement) return null;

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

  mouseDown(
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

const onResizeDico: Record<string, (e: any) => void> = {
  EdSelect_T: (e) => moveAndResize(e, 0, 1, 0, -1),
  EdSelect_B: (e) => moveAndResize(e, 0, 0, 0, 1),
  EdSelect_R: (e) => moveAndResize(e, 0, 0, 1, 0),
  EdSelect_L: (e) => moveAndResize(e, 1, 0, -1, 0),
  EdSelect_TR: (e) => moveAndResize(e, 0, 1, 1, -1),
  EdSelect_TL: (e) => moveAndResize(e, 1, 1, -1, -1),
  EdSelect_BR: (e) => moveAndResize(e, 0, 0, 1, 1),
  EdSelect_BL: (e) => moveAndResize(e, 1, 0, -1, 1),
};

const onMove = (e: any) => moveAndResize(e, 1, 1, 0, 0);

const onAdd = () => {
  setSelect(add(getSelect()));
};

const onDuplicate = () => {
  const s = getSelect();
  const a = add(s);
  if (!a) return;
  const data = exportData(s);
  importData(a, deepClone(data));
  setSelect(a);
};

const onAddIn = () => {
  setSelect(addIn(getSelect()));
};

const _onClick = B.prototype.onClick;
let _lastClick = { t: Date.now(), b: null as B | null };
B.prototype.onClick = function (event?: MouseEvent) {
  console.debug('onClick', this, event);
  const last = _lastClick;
  _lastClick = { b: this, t: Date.now() };
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  B.select$.set(this);
  if (last.b !== this) return;
  if (last.t + 200 < Date.now()) return;
  _onClick.call(this, event);
};

const onClick = () => {
  const b = getSelect();
  _lastClick = { b, t: Date.now() };
  b.onClick();
};

const onResizeList = Object.entries(onResizeDico);

function EdViewportPan() {
  const ref = useRef<HTMLDivElement>(null);
  const rootUpdated = useFlux(B.root.update$);
  const rootEl = B.root.el;
  const zoom = useFlux(zoom$);
  const screenSize = useFlux(screenSize$);
  const screenPos = useFlux(screenPos$);
  const panel = useFlux(panel$);

  console.debug('ViewportPan', rootUpdated);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    console.debug('ViewportPan el', el);
    el.appendChild(rootEl);
  }, [ref, rootEl]);

  useEffect(() => {
    const bodySize = document.body.getBoundingClientRect();
    console.debug('bodySize', { bodySize });
    if (!bodySize.width || !bodySize.height) return;

    const sideEl = document.getElementsByClassName('Side')[0];
    const terminalEl = document.getElementsByClassName('EdTerminal')[0];
    const marginWidth = sideEl?.getBoundingClientRect().width || 0;
    const marginHeight = terminalEl?.getBoundingClientRect().height || 0;

    const zoomW = (bodySize.width - marginWidth) / screenSize.w;
    const zoomH = (bodySize.height - marginHeight) / screenSize.h;
    const zoom = (zoomW < zoomH ? zoomW : zoomH) * 0.98;

    console.debug('bodySize', { bodySize, screenSize, zoomW, zoomH, zoom });
    zoom$.set(zoom);

    const panWidth = screenSize.w * zoom;
    const panHeight = screenSize.h * zoom;
    const viewportWidth = bodySize.width - marginWidth;
    const viewportHeight = bodySize.height - marginHeight;
    const x = (viewportWidth - panWidth) / 2;
    const y = (viewportHeight - panHeight) / 2;

    console.debug('bodySize', { panWidth, panHeight, viewportWidth, viewportHeight, x, y });

    screenPos$.set({ x, y });
    setSelect(B.root);
  }, [screenSize, panel, rootUpdated]);

  return (
    <div
      ref={ref}
      className="EdViewportPan"
      style={{
        transform: `scale(${zoom})`,
        width: `${screenSize.w}px`,
        height: `${screenSize.h}px`,
        top: `${screenPos.y}px`,
        left: `${screenPos.x}px`,
        transformOrigin: '0 0',
      }}
    />
  );
}

export const EdSelect = () => {
  console.debug('EdSelect');
  const pos = useFlux(pos$);

  const b = getSelect();
  const el = b?.el;
  if (!el) return <div className="EdSelect" />;

  const computedStyle = getComputedStyleCache(el);
  const isAbsolute = computedStyle && computedStyle.position === 'absolute';

  return (
    <div
      className="EdSelect"
      style={{
        left: pos[0] - 1,
        top: pos[1] - 1,
        width: pos[2] + 2,
        height: pos[3] + 2,
      }}
    >
      {onResizeList.map(([key, onResize]) => (
        <div key={key} onMouseDown={onResize} className={key} />
      ))}
      {isAbsolute && <div onMouseDown={onMove} className="EdSelect_C" />}
      <div className="EdActions">
        <div onMouseDown={onDuplicate} className="EdAction EdAction-Duplicate">
          <CopyPlus />
        </div>
        <div onMouseDown={onClick} className="EdAction EdAction-Click">
          <Eye />
        </div>
      </div>
      {/* <div onMouseDown={onAdd} className="EdAction EdAction-Add">
        <AddIcon />
      </div> */}
      {/* <div onMouseDown={onAddIn} className="EdAction EdAction-AddIn">
        <AddInIcon />
      </div> */}
    </div>
  );
}

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
  // '& .EdViewportPan': {
  //   position: 'absolute',
  //   overflow: 'auto',
  //   top: 0,
  //   left: 0,
  //   width: '100%',
  //   height: '100%',
  //   background: '#FFF',
  // },
  // '& .EdSelect': {
  //   position: 'absolute',
  //   top: -5,
  //   left: -5,
  //   width: 0,
  //   height: 0,
  //   border: '2px solid #1976d2',
  //   pointerEvents: 'none',
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
