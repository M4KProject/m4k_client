import { by, fluxStored, isBoolean, setAlpha, setHue, setLight, setSaturation } from 'fluxio';
import { isItem, setCssColors } from 'fluxio';
import { setHsl, addHsl, setRgb } from 'fluxio';
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

// export const C_PRIMARY = 'primary';
// export const C_SECONDARY = 'secondary';
// export const C_GREY = 'grey';
// export const C_WHITE = 'white';
// export const C_BLACK = 'black';
// export const C_INFO = 'info';
// export const C_SUCCESS = 'success';
// export const C_ERROR = 'error';
// export const C_WARN = 'warn';
// export const C_BODY = 'body';
// export const C_BG = 'bg';
// export const C_FG = 'fg';
// export const C_HEADER = 'header';
// export const C_HEADER_FG = 'headerFg';
// export const C_HANDLE = 'handle';

export const refreshTheme = () => {
  const { isDark, isUserDark, ...theme } = theme$.get();
  const d = isBoolean(isUserDark) ? isUserDark : isDark;

  const primary = theme.primary || '#28A8D9';
  const secondary = theme.secondary || addHsl(primary, { h: 360 / 3 });
  const grey = theme.grey || setSaturation(primary, 0);
  const base = setHsl(primary, { s: 100, l: 50 });
  const white = '#ffffff';
  const black = '#000000';
  const light = setLight(base, 95);
  const dark = setLight(base, 5);
  const lightFg = setLight(base, 85);
  const darkFg = setLight(base, 15);
  const body = d ? dark : light;
  const bg = d ? black : white;
  const fg = d ? lightFg : darkFg;
  const header = d ? dark : darkFg;
  const headerFg = d ? lightFg : light;
  const handle = white;
  const border = d ? setLight(grey, 30) : setLight(grey, 70);
  const info = setHue(base, 240);
  const success = setHue(base, 120);
  const error = setHue(base, 0);
  const warn = setHue(base, 30);
  const mask = d ? setRgb(bg, { a: 0.8 }) : setRgb(bg, { a: 0.8 });
  const shadow = setAlpha(darkFg, 0.2);
  const btn = d ? setHsl(primary, { s: 10, l: 5 }) : setHsl(primary, { s: 10, l: 95 });
  const media = d ? setHsl(primary, { s: 100, l: 5 }) : setHsl(primary, { s: 100, l: 5 });
  const selected = d ? setHsl(primary, { s: 100, l: 5 }) : setHsl(primary, { s: 100, l: 95 });

  Object.assign(theme, {
    primary,
    secondary,
    grey,
    base,
    white,
    black,
    light,
    dark,
    lightFg,
    darkFg,
    body,
    bg,
    fg,
    header,
    headerFg,
    handle,
    border,
    info,
    success,
    error,
    warn,
    mask,
    shadow,
    btn,
    media,
    selected,
  });

  setCssColors(theme as Dictionary<string>);
};

theme$.on(refreshTheme);
