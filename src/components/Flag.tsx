import { Css } from 'fluxio';
import { Dictionary } from 'fluxio';

const c = Css('Flag', {
  '': {
    display: 'inline-block',
    width: '1.33em',
    height: '1em',
    borderRadius: '2px',
    overflow: 'hidden',
    verticalAlign: 'middle',
  },
  '-square': {
    width: '1em',
    height: '1em',
  },
});

export interface FlagSVGProps {
  class?: string;
  iso: string; // ISO codes: fr, en, de, es, it
  title?: string;
  size?: string | number;
  variant?: '4x3' | '1x1'; // 4x3 (rectangle) or 1x1 (square)
}

// SVG flags for the 5 required languages
const FLAGS: Dictionary<any> = {
  fr: (
    <svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="600" fill="#002654" />
      <rect x="300" width="300" height="600" fill="#ffffff" />
      <rect x="600" width="300" height="600" fill="#ce1126" />
    </svg>
  ),
  en: (
    <svg viewBox="0 0 1200 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="600" fill="#012169" />
      <path d="M0,0 L1200,600 M1200,0 L0,600" stroke="#ffffff" strokeWidth="80" />
      <path d="M0,0 L1200,600 M1200,0 L0,600" stroke="#c8102e" strokeWidth="48" />
      <path d="M600,0 V600 M0,300 H1200" stroke="#ffffff" strokeWidth="100" />
      <path d="M600,0 V600 M0,300 H1200" stroke="#c8102e" strokeWidth="60" />
    </svg>
  ),
  de: (
    <svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="200" fill="#000000" />
      <rect y="200" width="900" height="200" fill="#dd0000" />
      <rect y="400" width="900" height="200" fill="#ffce00" />
    </svg>
  ),
  es: (
    <svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="600" fill="#aa151b" />
      <rect y="150" width="900" height="300" fill="#f1bf00" />
    </svg>
  ),
  it: (
    <svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="600" fill="#009246" />
      <rect x="300" width="300" height="600" fill="#ffffff" />
      <rect x="600" width="300" height="600" fill="#ce2b37" />
    </svg>
  ),
};

// Mapping for alternative codes
const ISO_MAPPING: Dictionary<string> = {
  gb: 'en', // Great Britain -> English flag
  uk: 'en', // United Kingdom -> English flag
};

export const Flag = ({ iso, title, size, variant = '4x3', ...props }: FlagSVGProps) => {
  // Normalize ISO code
  let normalizedIso = iso?.toLowerCase() || '';
  if (normalizedIso in ISO_MAPPING) {
    const iso = ISO_MAPPING[normalizedIso];
    if (iso) normalizedIso = iso;
  }

  // Get flag SVG or fallback
  const flagSVG = FLAGS[normalizedIso] || FLAGS['en']; // fallback to English

  // Determine title
  const flagTitle = title || `Flag of ${iso?.toUpperCase() || 'Unknown'}`;

  const style: any = {};
  if (size) {
    const sizeValue = typeof size === 'number' ? `${size}em` : size;
    style.width = variant === '1x1' ? sizeValue : `${parseFloat(sizeValue) * 1.33}em`;
    style.height = sizeValue;
  }

  return (
    <span {...c('', variant === '1x1' && '-square', props)} title={flagTitle} style={style}>
      {flagSVG}
    </span>
  );
};
