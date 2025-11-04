import { Style, Dictionary, Item } from 'fluxio';

export interface BoxFun {
  name?: string;
  target?: string;
  payload?: Item;
}

export interface WBoxItem {
  type?: string;
  name?: string;

  hide?: boolean;
  children?: string[];

  pos?: [number, number, number, number];
  cls?: string;
  style?: Style;
  props?: Dictionary<any>;

  html?: string;
  mediaId?: string;

  // // Carousel
  // delay?: number;
  // duration?: number;

  // Events
  onInit?: BoxFun;
  onClick?: BoxFun;
  // onShow?: BoxFun;
  // onHide?: BoxFun;

  // // Filter
  // page?: string;
  // category?: string;
  // tags?: string;

  // // Data
  // data?: Dictionary<string>;
}

export type BoxItem = Readonly<WBoxItem>;

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
