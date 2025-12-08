import type { Style, Dictionary, Item, NextState, Vector5, Vector7 } from 'fluxio';
import type { BoxIcon } from 'lucide-react';
import type { ComponentChildren } from 'preact';

export interface BFun {
  readonly name?: string;
  readonly target?: string;
  readonly payload?: Item;
}

export interface BData {

  /** Type */
  readonly t?: string;

  /** Parent index */
  readonly p?: number;

  /** Relations : children indices */
  readonly r?: number[];

  /** Class HTML */
  readonly c?: string;

  /** Name */
  readonly n?: string;

  /** Absolute x%, y%, width%, height% */
  readonly a?: [number, number, number, number];

  /** Style */
  readonly s?: Style;

  /** Body : text multiline text content with **bold** */
  readonly b?: string;

  /** Media Id */
  readonly m?: string;

  /** Data custom */
  readonly d?: Dictionary<any>;

  /** On Init event callback */
  readonly init?: BFun;

  /** On Click event callback */
  readonly click?: BFun;

  /** Filter */
  readonly f?: {

    /** Dates [start, end] : [['2025-12-01', '2025-12-10']] */
    readonly d?: [string, string][],

    /** Hours [start, end] : [[9, 12], [13.5, 18]] */
    readonly h?: [number, number][],

    /** Week Days [sunday, monday, tuesday, wednesday, thursday, friday, saturday] : [0, 1, 1, 0, 0, 0, 0] */
    readonly w?: Vector7<0|1>,

    /** DeviceId Dictionary : { "deviceId": 1 } */
    readonly i?: Dictionary<1>,
  };
  
}

export interface BItem extends BData {
  /** Index */
  readonly i: number; 

  /** Type */
  readonly t: string;
  
  /** Element HTML */
  readonly e?: HTMLElement;
}

export type NBData = BData | undefined | null;
export type NBItem = BItem | undefined | null;
export type NBItems = Readonly<NBItem[]>;
export type BKeys = keyof BItem;
export type BChanges = Partial<BItem>;
export type NBChanges = Partial<BItem> | undefined | null;
export type BPropNext<K extends BKeys> = NextState<BChanges[K]>;
export type BNext = NextState<NBChanges>;

export interface BFactoryProps {
  readonly i: number;
}
export interface BCompProps {
  readonly i: number;
  readonly item: BItem;
  readonly props: {
    readonly class: string;
    readonly style: any;
    readonly ref: (el: HTMLElement | undefined | null) => void;
    readonly onClick: (event: Event) => void;
  };
}
export type BComp = (props: BCompProps) => ComponentChildren;

export type A1 = 1 | 0 | -1;
export type BLabel = string;

export type BOnOff = 1 | 0;

export interface BEvent {
  i?: number;
  type?: string;
  item?: NBItem;
  el?: HTMLElement;
  event?: Event;
  count?: number;
  timeStamp?: number;
}

export interface BType {
  comp: BComp;
  label: string;
  icon?: typeof BoxIcon;
  r?: BOnOff;
  b?: BOnOff;
  a?: BOnOff;
  m?: BOnOff;
  layout?: BOnOff;
}

// // Carousel
// delay?: number;
// duration?: number;

// Events
// onShow?: BFun;
// onHide?: BFun;

// // Filter
// page?: string;
// category?: string;
// tags?: string;
