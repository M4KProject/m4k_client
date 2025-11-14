import {
  Dictionary,
  flux,
  logger,
  fluxUnion,
  stopEvent,
  isFunction,
  Pipe,
  isEmpty,
  getChanges,
  Writable,
  removeItem,
  uniq,
  isInt,
  isUInt,
  isNotEmpty,
} from 'fluxio';
import { BFun, BData, BItem, BItems, BNext, BKeys, BPropNext, BType, BEvent } from './bTypes';
import { BCarousel } from './BCarousel';
import { PanZoomCtrl } from '@/components/PanZoom';
import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import { fluxUndefined } from 'fluxio/flux/fluxUndefined';
import { ALargeSmall, FileIcon, GalleryHorizontal, Home, Square } from 'lucide-react';
import { app } from '@/app';
import { BText } from './BText';
import { BRect } from './BRect';
import { BRoot } from './BRoot';
import { BMedia } from './BMedia';

const log = logger('BCtrl');

const applyChanges = (items: BItem[], i: number, prev: BItem|undefined, next: BItem|undefined) => {
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

    if (nextParent && !nextParent.children?.includes(i)) {
      items[nextParent.i] = {
        ...nextParent,
        children: uniq([...nextParent.children||[], i]),
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

const toData = (item: BItem | undefined): BData | undefined => {
  if (!item) return undefined;
  const { i, parent, el, ...data } = item;
  if (data.children?.length === 0) delete data.children;
  return data;
}

const rect: BType = { comp: BRect, label: 'Rectangle', children: 1, pos: 1, icon: Square };
const root: BType = { comp: BRoot, label: 'Root', children: 1, icon: Home };
const text: BType = { comp: BText, label: 'Texte', text: 1, icon: ALargeSmall };
const carousel: BType = { comp: BCarousel, label: 'Carousel', children: 1, pos: 1, icon: GalleryHorizontal };
const media: BType = { comp: BMedia, label: 'Media', pos: 1, icon: FileIcon };

export class BCtrl {
  readonly registry: Dictionary<BType> = { root, rect, text, carousel, media };

  readonly funs: Dictionary<(boxEvent: BEvent) => void> = {};

  readonly items$ = flux<BItems>([]);

  readonly el?: HTMLElement;
  readonly parentId?: string;

  readonly init$ = flux<BEvent>({});
  readonly click$ = flux<BEvent>({});
  readonly event$ = fluxUnion(this.init$, this.click$);

  readonly panZoom = new PanZoomCtrl();

  constructor() {
    app.boxCtrl = this;
  }

  register(type: string, boxConfig: BType) {
    this.registry[type] = boxConfig;
  }

  getType(type: string|undefined) {
    if (!type) return rect;
    return this.registry[type] || rect;
  }

  funCall(fun: BFun | undefined, boxEvent: BEvent) {
    if (!fun) return;
    log.d('funCall', fun, boxEvent);
    if (fun.name) {
      this.funs[fun.name]?.(boxEvent);
    }
  }

  private newEvent(i: number, type: string, event?: Event): BEvent {
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

  getRef(i: number) {
    return (el: HTMLElement | undefined | null) => {
      if (el && this.get(i)?.el !== el) {
        this.init(i, el);
      }
    }
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

  getClick(i: number) {
    return (event: Event) => {
      this.click(i, event);
    }
  }

  getItems() {
    return this.items$.get();
  }

  get(index?: number) {
    if (isUInt(index)) return this.getItems()[index];
  }

  getData(index: number): BData|undefined {
    return toData(this.get(index));
  }

  // getDataWithChildren(index: number): BData|undefined {
  //   const items = this.getItems();
  //   const results: Writable<BData>[] = [];
  //   const add = (index: number) => {

  //   }
  //   const data = toData(items[index]);
  //   return results;
  // }

  getAllData() {
    return this.getItems().map(toData)
  }

  setAllData(data: BData[]) {
    log.d('setAllData', data);

    const items = [] as Writable<BItem>[];

    for (let i=0,l=data.length; i<l; i++) {
      const d = data[i];
      if (!d) continue;
      const item = { ...d, type: d.type || 'rect', i };
      const children = d.children;
      if (isNotEmpty(children)) item.children = uniq(children);
      items[i] = item;
    }

    const root = items[0] || (items[0] = { i:0, type: 'root' });
    root.type = 'root';

    for (let i=0,l=items.length; i<l; i++) {
      const item = items[i];
      if (!item) continue;
      const children = item.children;
      if (!children) continue;
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

  set(i?: number, replace?: BNext) {
    log.d('set', i, replace);
    if (!isUInt(i)) return;

    const items = this.getItems();

    const prev = items[i];

    const nextData = isFunction(replace) ? replace(prev) : replace;
    if (!nextData) return prev;

    const next: BItem = {
      ...nextData,
      type: nextData?.type || 'rect',
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

  update(i?: number, changes?: BNext) {
    log.d('update', i, changes);
    return this.set(i, prev => {
      if (!prev) return prev;
      const results = isFunction(changes) ? changes(prev) : changes;
      if (isEmpty(results)) return prev;
      return { ...prev, ...results };
    });
  }

  setProp<K extends BKeys>(i: number | undefined, prop: K, value: BPropNext<K>) {
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

  add(replace: BNext) {
    const i = this.getItems().length;
    this.set(i, replace);
  }

  delete(index?: number) {
    log.d('delete', index);
    if (!isUInt(index)) return false;
    const prev = this.get(index);
    if (!prev) return false;
    const items = this.getItems();
    this.items$.set(applyChanges([ ...items ], index, prev, undefined));
    return true;
  }

  getProp<K extends keyof BData>(i: number, prop: K) {
    return this.get(i)?.[prop];
  }

  item$(i?: number) {
    return isInt(i) ?
        this.items$.map(items => items[i])
      : (fluxUndefined as Pipe<BItem | undefined, BItems>);
  }

  prop$<K extends BKeys>(
    i: number | undefined,
    prop: K
  ): Pipe<BItem[K] | undefined, any> {
    return isInt(i) ?
        this.items$.map(items => items[i]?.[prop])
      : (fluxUndefined as Pipe<BItem[K] | undefined, any>);
  }
}

export const BContext = createContext<BCtrl | undefined>(undefined);

export const useBCtrl = () => useContext(BContext)!;
