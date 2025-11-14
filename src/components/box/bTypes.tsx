import type { Style, Dictionary, Item, NextState } from 'fluxio';
import type { BoxIcon } from 'lucide-react';
import type { ComponentChildren } from 'preact';
import type { BCtrl } from './BCtrl';

export interface BFun {
  readonly name?: string;
  readonly target?: string;
  readonly payload?: Item;
}

export interface BData {
  readonly children?: number[]; // children ids
  readonly type?: string;
  readonly cls?: string; // html class
  readonly name?: string;
  readonly hide?: boolean;
  readonly pos?: [number, number, number, number]; // absolute x%, y%, width%, height%
  readonly style?: Style; // style
  readonly text?: string; // multiline text content with **bold**
  readonly media?: string; // media id
  readonly init?: BFun; // on init event
  readonly click?: BFun; // on click event
  readonly data?: Dictionary<any>;
}

export interface BItem extends BData {
  readonly i: number;
  readonly type: string;
  readonly parent?: number; // parent index
  readonly children?: number[]; // children index
  readonly el?: HTMLElement;
}

export interface BHierarchy {
  readonly i: number;
  readonly parent?: BHierarchy;
  readonly children: BHierarchy[];
  readonly depth: number;
  readonly item: BItem;
}

export type BItems = Readonly<(BItem|undefined)[]>;
export type BKeys = keyof BItem;
export type BChanges = Partial<BItem>;
export type BPropNext<K extends BKeys> = NextState<BChanges[K]>;
export type BNext = NextState<BChanges | undefined>;

export interface BFactoryProps {
  readonly i: number;
}
export interface BCompProps {
  readonly i: number;
  readonly ctrl: BCtrl;
  readonly item: BItem;
  readonly props: {
    readonly class: string;
    readonly style: any;
    readonly ref: (el: HTMLElement | null) => void;
    readonly onClick: (event: Event) => void;
  }
}
export type BComp = (props: BCompProps) => ComponentChildren

export type A1 = 1 | 0 | -1;
export type BLabel = string;

export type BOnOff = 1|0

export interface BEvent {
  i?: number;
  type?: string;
  item?: BItem;
  el?: HTMLElement;
  event?: Event;
  count?: number;
  timeStamp?: number;
}

export interface BType {
  comp: BComp;
  label: string;
  children?: BOnOff;
  text?: BOnOff;
  pos?: BOnOff;
  icon?: typeof BoxIcon;
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
