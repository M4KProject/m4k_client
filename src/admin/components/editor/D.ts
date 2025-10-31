// type DImage = {
//     source?: string;
//     name?: string;
//     size?: [number, number];
//     mode?: string;
//     type?: string;
//     url?: string;
// };

// type DVideo = {
//     source?: string;
//     items: { t?: string, w?: number, h?: number, k?: string }[]
// };

// type DTranslate = Record<string, Partial<Node>>;

export type DId = string;
export type DLanguage = string;
// type DAnim = 'none' | 'slide' | 'fade' | 'zoom';

/**
 * Add class active on this on click :
 * ["cls", "active"]
 * or "cls:active"
 *
 * Add class screen on root :
 * ["to", "#root", ["cls", "screen"]]
 * or ["to", "#root", "cls:screen"]
 *
 * Remove "active" on all class "nav" and add "active" on current :
 * [
 *   ["to", "#root", "rmCls:active"],
 *   "cls:active"
 * ]
 *
 * Add active and remove after 5s :
 * [
 *   "cls:active",
 *   ["timer", 5, "rmCls:active"]
 * ]
 */
export type DCall = string;
export type DTr = Readonly<Record<DLanguage, D>>;
// type DContent = string;
// type DIcon = string;
// type DPrice = number;

export interface DStyle extends Partial<Record<keyof CSSStyleDeclaration, string>> {
  backgroundPosition?: 'center' | 'right' | 'left' | 'top' | 'bottom';
  backgroundPositionX?: 'right' | 'left' | 'center';
  backgroundPositionY?: 'top' | 'center' | 'bottom';
  backgroundRepeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
  backgroundSize?: 'auto' | 'contain' | 'cover';
  display?: 'inline' | 'block' | 'flex' | 'inline-flex' | 'none';
  overflow?: 'hidden' | 'auto';
  textOverflow?: 'clip' | 'ellipsis';
  visibility?: 'visible' | 'hidden';
  whiteSpace?: 'nowrap' | 'normal';
  position?: 'absolute' | 'fixed' | 'relative';
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'baseline' | 'stretch';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'baseline' | 'stretch';
  alignContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'baseline' | 'stretch';
  alignSelf?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  fontFamily?: string;
  fontSize?: string;
  fontStyle?: 'normal' | 'italic' | 'oblique';
  fontWeight?: 'light' | 'regular' | 'medium' | 'bold';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textTransform?: 'capitalize' | 'lowercase' | 'uppercase';
  lineHeight?: 'normal';
}

export type DAttributes = Record<string, string>;

/** {{AssetId}}_{{Format}} or URL : http(s):// */
export type DFile = string;

export interface D {
  /** ID */
  id?: DId;

  /** Cacher */
  hide?: boolean;

  /** Stock */
  stock?: number;

  /** Children */
  children?: D[];

  /** HTML Tag lower case */
  hTag?: string;

  /** Template Name */
  t?: string;

  /** Style */
  style?: DStyle;
  xs?: DStyle;
  sm?: DStyle;
  md?: DStyle;
  lg?: DStyle;
  xl?: DStyle;

  /** HTML content */
  ctn?: string;

  /** Classes : split(' ') */
  cls?: string;

  /** Attributes */
  attrs?: DAttributes;

  /** Page name */
  page?: string;

  /** Background File */
  bgImg?: DFile;

  /** Image for template */
  img?: DFile;

  /** Document PDF */
  doc?: DFile;

  /** Carousel delay */
  delay?: number;

  /** Carousel duration */
  duration?: number;

  /** Click event */
  click?: DCall;

  /** Filter */
  filter?: DCall;

  /** Render fun */
  render?: string;

  /** Translate */
  tr?: DTr;

  /** Current language */
  l?: string;

  /** Language */
  lang?: string;

  /** Alt for image or video */
  alt?: string;

  /** Source for image or video */
  src?: DFile;

  /** Source for video */
  video?: DFile;
  
  /** Template : Prop */
  prop?: keyof D;

  /** Template : Prop link */
  propLink?: keyof D;

  /** HTML title */
  title?: string;

  /** HTML desc */
  desc?: string;

  /** HTML info */
  info?: string;

  /** Volume cl */
  cl?: number;

  /** Price */
  prices?: number[];
  tPrices?: string[];

  allergens?: string;

  /** Mot clé pour la recherche */
  tags?: string[];

  /** Liste des icons */
  icons?: string[];

  /** List of css asset */
  cssFs?: DFile[];

  /** List of js asset */
  jsFs?: DFile[];

  /** Fonts */
  fonts?: string[];

  /** PDF for admin */
  pdf?: DFile;
}

export interface DRoot extends D {
  /** Templates */
  templates?: Record<string, D>;

  /** Home page name */
  home?: string;

  /** Version */
  version?: number;

  /** Box HTML Tag */
  boxTag?: string;

  /** Box Class */
  boxCls?: string;

  /** Product has count */
  hasCart?: boolean;

  /** For Admin */
  editor?: {
    screen?: {
      w: number;
      h: number;
    };
  };
}

export interface DReadonly extends Readonly<D> {
  ds?: DReadonly[];
}