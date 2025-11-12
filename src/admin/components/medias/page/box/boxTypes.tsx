import { Style, Dictionary, Item, NextState } from 'fluxio';

export interface BoxFun {
  readonly name?: string;
  readonly target?: string;
  readonly payload?: Item;
}

export interface BoxData {
  readonly children?: number[]; // children ids
  readonly type?: string;
  readonly class?: string; // html class
  readonly name?: string;
  readonly hide?: boolean;
  readonly pos?: [number, number, number, number]; // absolute x%, y%, width%, height%
  readonly style?: Style; // style
  readonly text?: string; // multiline text content with **bold**
  readonly media?: string; // media id
  readonly init?: BoxFun; // on init event
  readonly click?: BoxFun; // on click event
  readonly data?: Dictionary<any>;
}

export interface BoxItem extends BoxData {
  readonly i: number;
  readonly parent?: number; // parent index
  readonly children: number[]; // children index
  readonly el?: HTMLElement;
}

export interface BoxHierarchy {
  readonly i: number;
  readonly parent?: BoxHierarchy;
  readonly children: BoxHierarchy[];
  readonly depth: number;
  readonly item: BoxItem;
}

export type BoxItems = Readonly<BoxItem[]>;
export type BoxHierarchies = Readonly<BoxHierarchy[]>;
export type BoxProps = keyof BoxItem;
export type BoxChanges = Partial<BoxItem>;
export type BoxPropNext<K extends BoxProps> = NextState<BoxChanges[K]>;
export type BoxNext = NextState<BoxChanges | undefined>;

// // Carousel
// delay?: number;
// duration?: number;

// Events
// onShow?: BoxFun;
// onHide?: BoxFun;

// // Filter
// page?: string;
// category?: string;
// tags?: string;

// Data

// export const cleanBoxData = (d: BoxData) => {
//   delete d.l;
//   if (d.tr) {
//     const trFirst = Object.values(d.tr)[0] || {};
//     const props = Object.keys(trFirst);
//     props.forEach((prop) => delete (d as any)[prop]);
//   }
//   if (d.children) {
//     if (d.children.length === 0) {
//       delete d.children;
//     } else {
//       d.children.forEach(cleanBoxData);
//     }
//   }
//   const templates = (d as DRoot).templates;
//   if (templates) Object.values(templates).forEach(cleanD);
//   return d;
// };
