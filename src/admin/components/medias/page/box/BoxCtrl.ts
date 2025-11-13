import {
  Dictionary,
  flux,
  logger,
  fluxUnion,
  stopEvent,
  onHtmlEvent,
  isFunction,
  Pipe,
  isEmpty,
  getChanges,
  Writable,
  removeItem,
  uniq,
  isInt,
  randColor,
  isUInt,
} from 'fluxio';
import { ComponentType, createElement } from 'preact';
import { BoxFun, BoxData, BoxItem, BoxItems, BoxNext, BoxProps, BoxPropNext } from './boxTypes';
import { BoxCarousel } from './BoxCarousel';
import { PanZoomCtrl } from '@/components/PanZoom';
import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import { SCREEN_SIZES } from '../EditButtons';
import { fluxUndefined } from 'fluxio/flux/fluxUndefined';
import { BoxIcon } from 'lucide-react';
import { app } from '@/app';

const log = logger('BoxCtrl');

export type BoxComponent = ComponentType<any> | string;

export interface BoxEvent {
  i?: number;
  type?: string;
  item?: BoxItem;
  el?: HTMLElement;
  event?: Event;
  count?: number;
  timeStamp?: number;
}

export type A1 = 1 | 0 | -1;
export type BoxLabel = string;

type On = 1|0

export interface BoxConfig {
  comp: BoxComponent;
  label: string;
  children?: On;
  text?: On;
  pos?: On;
  render?: typeof createElement;
  icon?: typeof BoxIcon;
}

const applyChanges = (items: BoxItem[], i: number, prev: BoxItem|undefined, next: BoxItem|undefined) => {
  console.debug('applyChanges', items, i, prev, next);

  if (next) items[i] = next;
  else delete items[i];

  const prevParentIndex = prev?.parent;
  const nextParentIndex = next?.parent;

  const prevParent = isUInt(prevParentIndex) ? items[prevParentIndex] : undefined;
  const nextParent = isUInt(nextParentIndex) ? items[nextParentIndex] : undefined;

  if (prevParent !== nextParent) {
    if (prevParent) {
      items[prevParent.i] = {
        ...prevParent,
        children: removeItem(prevParent.children, i),
      };
    }

    if (nextParent && !nextParent.children.includes(i)) {
      items[nextParent.i] = {
        ...nextParent,
        children: uniq([...nextParent.children, i]),
      };
    }
  }

  // const prevChildIds = prev?.childIds || [];
  // const nextChildIds = next?.childIds || [];
  // const removed: Dictionary<1> = {};
  // const added: Dictionary<1> = {};
  // for (const id of prevChildIds) removed[id] = 1;
  // for (const id of nextChildIds) {
  //   if (id in removed) delete removed[id];
  //   else added[id] = 1;
  // }
  // if (!isEmpty(removed)) console.warn(`unauthorized remove childId`);
  // if (!isEmpty(added)) console.warn(`unauthorized added childId`);

  return items;
}

export class BoxCtrl {
  readonly registry: Dictionary<BoxConfig> = {
    box: { comp: 'div', label: 'Box', children: 1, pos: 1, icon: BoxIcon },
    text: { comp: 'span', label: 'Texte', text: 1, pos: 1 },
    carousel: { comp: BoxCarousel, label: 'Carousel', children: 1, pos: 1 },
  };
  readonly funs: Dictionary<(boxEvent: BoxEvent) => void> = {};

  readonly items$ = flux<BoxItems>([]);

  readonly el?: HTMLElement;
  readonly parentId?: string;

  readonly init$ = flux<BoxEvent>({});
  readonly click$ = flux<BoxEvent>({});
  readonly event$ = fluxUnion(this.init$, this.click$);

  readonly panZoom = new PanZoomCtrl();
  public handlesEl?: HTMLDivElement | null;

  constructor() {
    app.boxCtrl = this;

    this.panZoom.ready$.on(() => {
      const el = this.panZoom.viewport();
      onHtmlEvent(el, 'click', (event) => {
        this.click$.set({ el, event });
      });

      const [w, h] = SCREEN_SIZES[0]!;
      this.panZoom.setSize(w, h);
    });
  }

  getType(type?: string): BoxConfig {
    return this.registry[type||'box'] || this.registry.box!;
  }

  register(type: string, boxConfig: BoxConfig) {
    this.registry[type] = boxConfig;
  }

  funCall(fun: BoxFun | undefined, boxEvent: BoxEvent) {
    if (!fun) return;
    log.d('funCall', fun, boxEvent);
    if (fun.name) {
      this.funs[fun.name]?.(boxEvent);
    }
  }

  private newEvent(i: number, type: string, event?: Event): BoxEvent {
    const item = this.get(i);
    const el = item?.el;
    return { i, item, el, type, event, timeStamp: Date.now() };
  }

  init(i: number, el: HTMLElement) {
    const prev = this.get(i);
    log.d('init', i, el, prev, 'prev.el:', prev?.el);
    if (!prev) return;

    const next = this.update(i, { el });
    const boxEvent = this.newEvent(i, 'init');

    log.d('init event', boxEvent, 'next.el:', next?.el);
    this.funCall(next?.init, boxEvent);
    this.init$.set(boxEvent);
  }

  click(i: number, event?: Event): void {
    const box = this.get(i);
    log.d('click', i, event, box);

    stopEvent(event);

    const lastEvent = this.click$.get();
    const boxEvent = this.newEvent(i, 'click', event);
    boxEvent.count = (lastEvent.i === i ? lastEvent.count || 1 : 0) + 1;

    log.d('click event', boxEvent, 'el:', boxEvent.el);
    this.funCall(box?.click, boxEvent);
    this.click$.set(boxEvent);
  }

  getItems() {
    return this.items$.get();
  }

  get(i?: number) {
    if (isUInt(i)) return this.getItems()[i];
  }

  delete(i?: number) {
    return this.set(i, undefined);
  }

  getAllData() {
    const data = [] as BoxData[];
    // by(
    //   this.getItems(),
    //   (_, i) => i,
    //   (item): BoxData => {
    //     const { i, parent, el, children, ...rest } = item;
    //     const data = rest as Writable<BoxData>;
    //     if (children.length) data.children = children;
    //     return data;
    //   }
    // );
    return data;
  }

  setAllData(data: BoxData[]) {
    log.d('setAllData', data);

    const items = [] as Writable<BoxItem>[];

    for (let i=0,l=data.length; i<l; i++) {
      const d = data[i];
      if (!d) continue;
      items[i] = { ...d, i, children: uniq(d.children||[]) };
    }

    for (let i=0,l=items.length; i<l; i++) {
      const item = items[i];
      if (!item) continue;
      const children = item.children;
      const removed: number[] = [];
      for (const childIndex of children) {
        const child = items[childIndex];
        if (!child) {
          removed.push(childIndex);
          continue;
        }
        child.parent = i;
      }
      for (const childId of removed) {
        removeItem(children, childId);
      }
    }

    this.items$.set(items);
  }

  set(i?: number, replace?: BoxNext) {
    log.d('set', i, replace);
    if (!isUInt(i)) return;

    const items = this.getItems();

    const prev = items[i];

    const nextData = isFunction(replace) ? replace(prev) : replace;
    const next: BoxItem = {
      ...nextData,
      parent: nextData?.parent || (i === 0 ? undefined : 0),
      children: uniq(nextData?.children || []),
      i,
    };

    const changes = prev && next && getChanges(prev, next);
    if (changes && isEmpty(changes)) return prev;

    log.d('set changes', i, changes);
    this.items$.set(applyChanges([ ...items ], i, prev, next));

    return next;
  }

  update(i?: number, changes?: BoxNext) {
    log.d('update', i, changes);
    return this.set(i, prev => {
      if (!prev) return prev;
      const results = isFunction(changes) ? changes(prev) : changes;
      if (isEmpty(results)) return prev;
      return { ...prev, ...results };
    });
  }

  setProp<K extends BoxProps>(i: number | undefined, prop: K, value: BoxPropNext<K>) {
    log.d('setProp', i, prop, value);
    return this.set(i, prev => {
      if (!prev) return prev;
      const prevValue = prev[prop];
      const nextValue = isFunction(value) ? value(prevValue) : value;
      if (prevValue === nextValue) return prev;
      const next = { ...prev, [prop]: nextValue };
      return next;
    });
  }

  add() {
    const i = this.getItems().length;
    this.set(i, {
      pos: [25, 25, 50, 50],
      style: {
        bg: randColor(),
      },
    });
  }

  getProp<K extends keyof BoxData>(i: number, prop: K) {
    return this.get(i)?.[prop];
  }

  item$(i?: number) {
    return isInt(i) ?
        this.items$.map(items => items[i])
      : (fluxUndefined as Pipe<BoxItem | undefined, BoxItems>);
  }
  
  prop$<K extends BoxProps>(
    i: number | undefined,
    prop: K
  ): Pipe<BoxItem[K] | undefined, any> {
    return isInt(i) ?
        this.items$.map(items => items[i]?.[prop])
      : (fluxUndefined as Pipe<BoxItem[K] | undefined, any>);
  }
}

export const BoxContext = createContext<BoxCtrl | undefined>(undefined);

export const useBoxCtrl = () => useContext(BoxContext)!;
