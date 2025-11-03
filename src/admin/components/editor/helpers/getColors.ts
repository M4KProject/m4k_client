import { B } from '../B';

export function getColors(b: B) {
  const colorDico: Record<string, boolean> = {};
  b.forEach((bChild) => {
    const s = getComputedStyle(bChild.el);
    if (s.color) colorDico[s.color] = true;
    if (s.borderTopColor) colorDico[s.borderTopColor] = true;
    if (s.borderLeftColor) colorDico[s.borderLeftColor] = true;
    if (s.borderRightColor) colorDico[s.borderRightColor] = true;
    if (s.borderBottomColor) colorDico[s.borderBottomColor] = true;
    if (s.backgroundColor) colorDico[s.backgroundColor] = true;
  });
  return Object.keys(colorDico);
}
