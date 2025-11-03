import { B } from '../B';
import { DStyle } from '../D';

export const rmStyleProp = (b: B, prop: keyof DStyle) => {
  if (!b.d.style) return;
  delete b.d.style[prop];
  b.update({ style: b.d.style });
};
