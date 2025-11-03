import { B } from '../B';

export const getLangs = () => {
  const langDico: Record<string, 1> = {};
  B.root.forEach((b) => b.d.lang && (langDico[b.d.lang] = 1));
  return Object.keys(langDico);
};
