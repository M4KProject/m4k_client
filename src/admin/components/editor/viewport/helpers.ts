import { add } from '../helpers/add';
import { addIn } from '../helpers/addIn';
import { exportData } from '../helpers/exportData';
import { importData } from '../helpers/importData';
import { setSelect } from '../helpers/setSelect';
import { B, BElement } from '../B';
import { deepClone, toNumber } from 'fluxio';

type UnitType = 'rem' | 'em' | 'px' | '%';

export const unitDecompose = (unit: string): [number, UnitType] => {
  const m = unit.match(/([0-9\.]+) ?([a-z%]+)/);
  return m ? [toNumber(m[1], 0), (m[2] as any) || 'px'] : [0, 'px'];
};

export const getResizeBox = (): B | null => {
  const b = B.select$.get();
  if (!b) return null;

  if (b.parent) {
    const parentType = b.parent.d.t;
    if (parentType === 'carousel' || parentType === 'pdf') {
      setSelect(b.parent);
      return getResizeBox();
    }
  }

  return b;
};

let ctrlKey = false;

export const moveAndResize = (
  e: any,
  aX: -1 | 1 | 0,
  aY: -1 | 1 | 0,
  aW: -1 | 1 | 0,
  aH: -1 | 1 | 0
) => {
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
};

export const onMove = (e: any) => moveAndResize(e, 1, 1, 0, 0);

export const getSelectOrRoot = () => B.select$.get() || B.root;

export const onAdd = () => {
  setSelect(add(getSelectOrRoot()));
};

export const onDuplicate = () => {
  const s = getSelectOrRoot();
  const a = add(s);
  if (!a) return;
  const data = exportData(s);
  importData(a, deepClone(data));
  setSelect(a);
};

export const onAddIn = () => {
  setSelect(addIn(getSelectOrRoot()));
};

export const getComputedStyleCache = (() => {
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

let _lastClick = { t: Date.now(), b: null as B | null };

export const onClick = () => {
  const b = getSelectOrRoot();
  _lastClick = { b, t: Date.now() };
  b.onClick();
};

const _onClick = B.prototype.onClick;

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
