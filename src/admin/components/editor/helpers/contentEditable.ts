import { B, BElement } from '../B';

export const contentEditable = (_b: B, el: BElement) => {
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

export const setupContentEditableProp = () => {
  B.props.ctn = (el, v, b) => {
    el.innerHTML = v;
    contentEditable(b, el);
  };
};
