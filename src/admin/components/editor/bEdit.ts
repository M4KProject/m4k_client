import { deepClone } from 'fluxio';
import { B, BElement } from './B';
import { D, DRoot, DStyle } from './D';
import { clipboardCopy, clipboardPaste } from '@common/ui';

const cleanD = (d: D) => {
  delete d.l;
  if (d.tr) {
    const trFirst = Object.values(d.tr)[0] || {};
    const props = Object.keys(trFirst);
    props.forEach((prop) => delete (d as any)[prop]);
  }
  if (d.children) {
    if (d.children.length === 0) {
      delete d.children;
    } else {
      d.children.forEach(cleanD);
    }
  }
  const templates = (d as DRoot).templates;
  if (templates) Object.values(templates).forEach(cleanD);
  return d;
};

const contentEditable = (_b: B, el: BElement) => {
  // const elAny = el as any;
  // const clickKey = `_${prop}EditableClic`;
  // const blurKey = `_${prop}EditableBlur`;
  // const oldListener = elAny[clickKey];
  // if (elAny[clickKey]) el.removeEventListener('click', elAny[clickKey]);
  // if (elAny[blurKey]) el.removeEventListener('click', elAny[blurKey]);
  // elAny[clickKey] = el.addEventListener('click', () => {
  //   console.debug('contentEditable click', b, el, prop);
  //   if (el.contentEditable === "true") {
  //     el.contentEditable === "false";
  //   }
  //   el.contentEditable = "true";
  //   if (elAny[blurKey]) el.removeEventListener('click', elAny[blurKey]);
  //   elAny[blurKey] = el.addEventListener('blur', () => {
  //     console.debug('contentEditable blur', b, el, prop);
  //     b.update({ [prop]: el.innerHTML });
  //   });
  // });

  if (el.contentEditable === 'true') return;
  // el.contentEditable = 'true';
  // el.addEventListener('blur', () => {
  //   const prop = el._d?.prop || 'ctn';
  //   console.debug('contentEditable blur', b, el, prop);
  //   if (b.d[prop] !== el.innerHTML) {
  //     b.update({ [prop]: el.innerHTML });
  //   }
  // });
};

B.props.ctn = (el, v, b) => {
  el.innerHTML = v;
  contentEditable(b, el);
};

const histories: DRoot[] = [];
let historyIndex: number = 0;
let historyTimer: any = null;

export const addHistory = () => {
  console.debug('addHistory');
  clearTimeout(historyTimer);
  historyTimer = setTimeout(() => {
    console.debug('addHistory cb');
    const data = exportData(B.root) as DRoot;
    histories.length = historyIndex;
    histories.push(data);
    historyIndex = histories.length;
  }, 1000);
};

export const undo = () => {
  console.debug('undo');
  historyIndex--;
  if (historyIndex >= histories.length) {
    return (historyIndex = histories.length);
  }
  if (historyIndex === histories.length - 1) {
    historyIndex--;
  }
  if (historyIndex < 0) {
    return (historyIndex = 0);
  }
  const data = histories[historyIndex];
  if (data) {
    B.importRoot(data);
    clearTimeout(historyTimer);
  }
};

export const redo = () => {
  console.debug('redo');
  historyIndex++;
  if (historyIndex < 0) {
    return (historyIndex = 0);
  }
  if (historyIndex >= histories.length) {
    return (historyIndex = histories.length);
  }
  const data = histories[historyIndex];
  if (data) {
    B.importRoot(data);
    clearTimeout(historyTimer);
  }
};

export const selectUp = (): void => {
  const parent = B.select$.v?.parent;
  if (parent) B.select$.set(parent);
};

export const getLangs = () => {
  const langDico: Record<string, 1> = {};
  B.root.forEach((b) => b.d.lang && (langDico[b.d.lang] = 1));
  return Object.keys(langDico);
};

export const rmProp = (b: B, prop: keyof D) => {
  delete b.d[prop];
  b.setData(b.d);
};

export const rmStyleProp = (b: B, prop: keyof DStyle) => {
  if (!b.d.style) return;
  delete b.d.style[prop];
  b.update({ style: b.d.style });
};

export const exportData = (b: B) => {
  console.debug('exportData');
  const d = deepClone(b.d);
  cleanD(d);
  return d;
};

export const importData = (b: B, d: DRoot) => {
  console.debug('importData', d);
  cleanD(d);
  if (b === B.root) {
    B.importRoot(d);
    return;
  }
  b.setData(d);
};

export const remove = (b: B) => {
  console.debug('remove', b);
  if (!b.parent) return;
  const parentChildren = [...(b.parent.d.children || [])];
  const index = parentChildren.indexOf(b.d);
  if (index === -1) return;
  parentChildren.splice(index, 1);
  b.parent.update({ children: parentChildren });
  return b.parent;
};

export const add = (b: B) => {
  console.debug('add');
  if (!b.parent) return;
  const parentChildren = [...(b.parent.d.children || [])];
  const index = parentChildren.indexOf(b.d);
  if (index === -1) return;
  parentChildren.splice(index + 1, 0, {});
  b.parent.update({ children: parentChildren });
  return b.parent.children[index + 1];
};

export const addIn = (b: B) => {
  console.debug('addIn');
  const children = [...(b.d.children || [])];
  children.push({});
  b.update({ children });
  return b.children[b.children.length - 1];
};

export const cut = (b: B) => {
  console.debug('cut');
  clipboardCopy(exportData(b));
  return remove(b);
};

export const copy = (b: B) => {
  console.debug('copy');
  clipboardCopy(exportData(b));
  return b;
};

export const paste = async (bParent: B) => {
  const d = await clipboardPaste();
  console.debug('paste', d);
  if (!d) return;
  const b = add(bParent);
  if (!b) return;
  importData(b, d);
  return b;
};

export const pasteIn = async (bParent: B) => {
  const d = await clipboardPaste();
  console.debug('pasteIn', d);
  if (!d) return;
  const b = addIn(bParent);
  if (!b) return;
  importData(b, d);
  return b;
};

// export function getColors(b: B) {
//   const colorDico: Record<string, boolean> = {};
//   b.forEach((bChild) => {
//     const s = getComputedStyle(bChild.el);
//     if (s.color) colorDico[s.color] = true;
//     if (s.borderTopColor) colorDico[s.borderTopColor] = true;
//     if (s.borderLeftColor) colorDico[s.borderLeftColor] = true;
//     if (s.borderRightColor) colorDico[s.borderRightColor] = true;
//     if (s.borderBottomColor) colorDico[s.borderBottomColor] = true;
//     if (s.backgroundColor) colorDico[s.backgroundColor] = true;
//   });
//   return Object.keys(colorDico);
// }

let lastSelectEl: HTMLElement | null = null;
B.select$.on((b) => {
  // if (b && b.parent) {
  //   const parentType = b.parent.d.t;
  //   if (parentType === 'carousel' || parentType === 'pdf') {
  //     B.select$.set(b.parent);
  //     return;
  //   }
  // }

  const active = document.activeElement;
  if (active && (active as HTMLElement).blur) {
    (active as HTMLElement).blur();
  }

  while (lastSelectEl) {
    lastSelectEl.classList.remove('ed-selected');
    lastSelectEl = lastSelectEl.parentElement;
  }
  if (!b) return;
  let el: HTMLElement | null = (lastSelectEl = b.el);
  while (el) {
    el.classList.add('ed-selected');
    el = el.parentElement;
  }
});

B.update$.on(({ b, d }) => {
  console.debug('B.update$', b, d);
  if (!b) return;
  if (d) {
    if (b.d.children?.length === 0) delete b.d.children;
    addHistory();
  }
});

export const getSelect = () => {
  return B.select$.v || B.root;
};

export const setSelect = (b?: B | null) => {
  if (!b) return;
  B.select$.set(b);
};
