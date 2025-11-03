import { D, DRoot } from '../D';

export const cleanD = (d: D) => {
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
