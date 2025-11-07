import { by, fluxStored, isBoolean } from 'fluxio';
import { isItem, setCssColors } from 'fluxio';
import { setHsl, addHsl, toHsl, toColor, setRgb } from 'fluxio';
import { Dictionary } from 'fluxio';

export interface ThemeInfo {
  isDark?: boolean;
  isUserDark?: boolean;
  primary?: string;
  secondary?: string;
  grey?: string;
}

export const theme$ = fluxStored<ThemeInfo>('theme$', {}, isItem);

export const updateTheme = (changes?: Partial<ThemeInfo>) => {
  theme$.set((prev) => ({ ...prev, ...changes }));
};

// export const lerp = (points: [number, number][]): ((x: number) => number) => {
//   const sorted = [...points].sort((a, b) => a[0] - b[0]);
//   return (x: number) => {
//     if (x <= sorted[0][0]) return sorted[0][1];
//     if (x >= sorted[sorted.length - 1][0]) return sorted[sorted.length - 1][1];
//     for (let i = 0; i < sorted.length - 1; i++) {
//       const [x1, y1] = sorted[i];
//       const [x2, y2] = sorted[i + 1];
//       if (x >= x1 && x <= x2) {
//         return y1 + ((y2 - y1) * (x - x1)) / (x2 - x1);
//       }
//     }
//     return 0;
//   };
// };

export const newColors = (p: string, color: string, isD: boolean = false) => {
  const { h, s, l } = toHsl(color);
  const hList = [52, 37, 26, 12, 6, 0, -6, -12, -18, -24];
  if (isD) hList.reverse();
  return {
    ...by(
      hList,
      (_, i) => p + i,
      (v, i) => toColor({ h, s, l: l + v })
    ),
  };
};

export const refreshTheme = () => {
  const { isDark, isUserDark, ...t } = theme$.get();
  const isD = isBoolean(isUserDark) ? isUserDark : isDark;

  const primary = t.primary || '#28A8D9';
  const secondary = t.secondary || addHsl(primary, { h: 360 / 3 });
  const grey = t.grey || setHsl(primary, { s: 0 });

  const w0 = '#ffffff';
  const w1 = setHsl(primary, { s: 30, l: 98 });
  const w2 = setHsl(primary, { s: 30, l: 95 });
  const w3 = setHsl(primary, { s: 30, l: 90 });
  const g0 = '#000000';
  const g1 = setHsl(primary, { s: 30, l: 5 });
  const g2 = setHsl(primary, { s: 30, l: 10 });
  const g3 = setHsl(primary, { s: 30, l: 15 });
  const b0 = isD ? g0 : w0;
  const b1 = isD ? g1 : w1;
  const b2 = isD ? g2 : w2;
  const b3 = isD ? g3 : w3;
  const t0 = isD ? w0 : g0;
  const t1 = isD ? w1 : g1;
  const t2 = isD ? w2 : g2;
  const t3 = isD ? w3 : g3;
  const mask = isD ? setRgb(b3, { a: 0.8 }) : setRgb(b3, { a: 0.8 });
  const shadow =
    isD ? setHsl(primary, { s: 100, l: 10 }) : setHsl(primary, { s: 100, l: 20, a: 0.1 });

  Object.assign(t, {
    primary,
    secondary,
    grey,
    w0,
    w1,
    w2,
    w3,
    g0,
    g1,
    g2,
    g3,
    b0,
    b1,
    b2,
    b3,
    t0,
    t1,
    t2,
    t3,
    mask,
    shadow,
  });

  Object.assign(t, {
    ...newColors('p', primary, isD),
    ...newColors('s', secondary, isD),
    ...newColors('g', grey, isD),
    info: setHsl(primary, { h: 240 }),
    success: setHsl(primary, { h: 120, l: 40 }),
    error: setHsl(primary, { h: 0 }),
    warn: setHsl(primary, { h: 30 }),
  });

  setCssColors(t as Dictionary<string>);
};

theme$.on(refreshTheme);
