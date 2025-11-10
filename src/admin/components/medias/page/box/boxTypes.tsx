import { Style, Dictionary, Item } from 'fluxio';

export interface BoxFun {
  readonly name?: string;
  readonly target?: string;
  readonly payload?: Item;
}

export interface BoxData {
  readonly type?: string;
  readonly children?: string[];

  readonly name?: string;
  readonly hide?: boolean;

  readonly pos?: [number, number, number, number];
  readonly cls?: string;
  readonly style?: Style;


  readonly text?: string;
  readonly mediaId?: string;

  readonly onInit?: BoxFun;
  readonly onClick?: BoxFun;

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
  readonly data?: Dictionary<any>;
}

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
