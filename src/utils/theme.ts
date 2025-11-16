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

// export const newColors = (p: string, color: string, isD: boolean = false) => {
//   const { h, s, l } = toHsl(color);
//   const hList = [52, 37, 26, 12, 6, 0, -6, -12, -18, -24];
//   if (isD) hList.reverse();
//   return {
//     ...by(
//       hList,
//       (_, i) => p + i,
//       (v, i) => toColor({ h, s, l: l + v })
//     ),
//   };
// };

export const refreshTheme = () => {
  const { isDark, isUserDark, ...theme } = theme$.get();
  const isD = isBoolean(isUserDark) ? isUserDark : isDark;

  const p = theme.primary || '#28A8D9';
  const s = theme.secondary || addHsl(p, { h: 360 / 3 });
  const g = theme.grey || setHsl(p, { s: 0 });
  const w = '#ffffff';
  const b = '#000000';
  const bg = isD ? b : w;
  const bg0 = isD ? setHsl(p, { s: 100, l: 5 }) : setHsl(p, { s: 100, l: 95 });
  const t = isD ? w : b;
  const handle = w;
  const border = isD ? setHsl(w, { l: 30 }) : setHsl(w, { l: 70 });
  const info = setHsl(p, { h: 240 });
  const success = setHsl(p, { h: 120, l: 40 });
  const error = setHsl(p, { h: 0 });
  const warn = setHsl(p, { h: 30 });
  const mask = isD ? setRgb(bg, { a: 0.8 }) : setRgb(bg, { a: 0.8 });
  const shadow = isD ? setHsl(p, { l: 10 }) : setHsl(p, { s: 100, l: 20, a: 0.1 });
  const btn = isD ? setHsl(p, { s: 10, l: 5 }) : setHsl(p, { s: 10, l: 95 });
  const media = isD ? setHsl(p, { s: 100, l: 5 }) : setHsl(p, { s: 100, l: 5 });

  Object.assign(theme, {
    handle,
    bg,
    bg0,
    t,
    border,
    p,
    s,
    g,
    info,
    success,
    error,
    warn,
    mask,
    shadow,
    btn,
    media,
  });

  setCssColors(theme as Dictionary<string>);
};

theme$.on(refreshTheme);
