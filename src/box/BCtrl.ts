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
} from 'fluxio';
import {
  BFun,
  BData,
  BItem,
  NBItems,
  BNext,
  BKeys,
  BPropNext,
  BType,
  BEvent,
  NBData,
  NBItem,
} from './bTypes';
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
import { PageModel } from '@/api/models';
import { Api } from '@/api/Api';

const log = logger('BCtrl');

const applyChanges = (items: Writable<NBItems>, index: number, prev: NBItem, next: NBItem) => {
  console.debug('applyChanges', index, 'prev:', prev, 'next:', next);

  if (next) items[index] = next;
  else delete items[index];

  const prevP = prev?.p;
  const nextP = next?.p;

  const prevParent = isUInt(prevP) ? items[prevP] : undefined;
  const nextParent = isUInt(nextP) ? items[nextP] : undefined;

  if (prevParent !== nextParent) {
    if (prevParent) {
      items[prevParent.i] = {
        ...prevParent,
        r: removeItem([...(prevParent.r || [])], index),
      };
    }

    if (nextParent && !nextParent.r?.includes(index)) {
      items[nextParent.i] = {
        ...nextParent,
        r: uniq([...(nextParent.r || []), index]),
      };
    }
  }

  return items;
};

const getDefaultType = (d: BData) =>
  d.b ? 'text'
  : d.m ? 'media'
  : 'rect';

const toItems = (data: NBData[], items: Writable<NBItem>[] = []) => {
  for (let i = 0, l = data.length; i < l; i++) {
    const d = data[i];
    if (!d) continue;

    items[i] = {
      ...d,
      t: d.t || getDefaultType(d),
      r: d.r ? uniq(d.r) : [],
      i,
    };
  }

  const root = items[0] || (items[0] = { i: 0, t: '' });
  root.t = 'root';

  for (let i = 0, l = items.length; i < l; i++) {
    const item = items[i];
    if (!item) continue;

    const relation = item.r;
    if (!relation) continue;

    const removed: number[] = [];
    for (const childIndex of relation) {
      const child = items[childIndex];
      if (!child) {
        removed.push(childIndex);
        continue;
      }
      child.p = i;
    }

    for (const childId of removed) {
      removeItem(relation, childId);
    }
  }

  return items as NBItem[];
};

const toData = (item: NBItem): NBData => {
  if (!item) return null;
  const { i, p, e, ...d } = item;
  if (d.r?.length === 0) delete d.r;
  if (getDefaultType(d) === d.t) delete (d as Writable<BData>).t;
  return d;
};

const rect: BType = { comp: BRect, label: 'Rectangle', r: 1, a: 1, icon: Square };
const root: BType = { comp: BRoot, label: 'Racine', r: 1, icon: Home };
const text: BType = { comp: BText, label: 'Texte', b: 1, a: 1, icon: ALargeSmall };
const carousel: BType = { comp: BCarousel, label: 'Carousel', r: 1, a: 1, icon: GalleryHorizontal };
const media: BType = { comp: BMedia, label: 'Media', m: 1, a: 1, icon: FileIcon };

export class BCtrl {
  readonly registry: Dictionary<BType> = { root, rect, text, carousel, media };

  readonly funs: Dictionary<(boxEvent: BEvent) => void> = {};

  readonly items$ = flux<NBItems>([]);

  readonly el?: HTMLElement;
  readonly parentId?: string;

  readonly init$ = flux<BEvent>({});
  readonly select$ = flux<BEvent>({});
  readonly event$ = fluxUnion(this.init$, this.select$);

  readonly panZoom = new PanZoomCtrl();

  readonly api: Api;
  readonly pageId: string;

  constructor(api: Api, pageId: string) {
    this.api = api;
    this.pageId = pageId;
    app.boxCtrl = this;
    this.load();
  }

  async load() {
    const page = await this.api.media.coll.get(this.pageId);
    console.debug('BCtrl load', this.pageId, media);
    if (page?.type === 'page') {
      this.setAllData(page.data?.boxes || []);
    }
  }

  async save() {
    const boxes = this.getAllData();
    console.debug('BCtrl save', this.pageId, boxes);
    await this.api.media.update(this.pageId, {
      data: { boxes },
    });
  }

  register(type: string, boxConfig: BType) {
    this.registry[type] = boxConfig;
  }

  getType(type: string | undefined) {
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
    const el = item?.e;
    return { i, item, el, type, event, timeStamp: Date.now() };
  }

  init(i: number, el: HTMLElement) {
    const prev = this.get(i);
    log.d('init', i, el, prev, 'prev.el:', prev?.e);
    if (!prev) return;

    const next = this.update(i, { e: el });
    const boxEvent = this.newEvent(i, 'init');

    log.d('init event', boxEvent, 'next.e:', next?.e);
    this.funCall(next?.init, boxEvent);
    this.init$.set(boxEvent);
  }

  getRef(i: number) {
    return (el: HTMLElement | undefined | null) => {
      if (el && this.get(i)?.e !== el) {
        this.init(i, el);
      }
    };
  }

  click(i: number, event?: Event): void {
    const box = this.get(i);
    log.d('click', i, event, box);

    stopEvent(event);

    const lastEvent = this.select$.get();
    const boxEvent = this.newEvent(i, 'click', event);
    boxEvent.count = (lastEvent.i === i ? lastEvent.count || 1 : 0) + 1;

    log.d('click event', boxEvent, 'el:', boxEvent.el);
    this.funCall(box?.click, boxEvent);
    this.select$.set(boxEvent);
  }

  getClick(i: number) {
    return (event: Event) => {
      this.click(i, event);
    };
  }

  getItems() {
    return this.items$.get();
  }

  get(index?: number) {
    return isUInt(index) ? this.getItems()[index] : null;
  }

  getData(index?: number) {
    return toData(this.get(index));
  }

  getAllData() {
    return this.getItems().map(toData);
  }

  setAllData(data: NBData[]) {
    log.d('setAllData', data);
    const items = toItems(data);
    if (!items.length) {
      items;
    }
    this.items$.set(items);
  }

  set(index?: number, replace?: BNext) {
    log.d('set', index, replace);
    if (!isUInt(index)) return;

    const items = this.getItems();

    const prev = items[index];

    const d = isFunction(replace) ? replace(prev) : replace;
    if (!d) return prev;

    const next: BItem = {
      ...d,
      t: d?.t || getDefaultType(d),
      p: d?.p || (index === 0 ? undefined : 0),
      r: uniq(d?.r || []),
      i: index,
    };

    const changes = prev && next && getChanges(prev, next);
    if (changes && isEmpty(changes)) return prev;

    log.d('set changes', index, changes);
    this.items$.set(applyChanges([...items], index, prev, next));

    return next;
  }

  update(i?: number, changes?: BNext) {
    log.d('update', i, changes);
    return this.set(i, (prev) => {
      if (!prev) return prev;
      const results = isFunction(changes) ? changes(prev) : changes;
      if (isEmpty(results)) return prev;
      return { ...prev, ...results };
    });
  }

  setProp<K extends BKeys>(i: number | undefined, prop: K, value: BPropNext<K>) {
    log.d('setProp', i, prop, value);
    return this.set(i, (prev) => {
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
    this.items$.set(applyChanges([...items], index, prev, undefined));
    return true;
  }

  getProp<K extends keyof BData>(i: number, prop: K) {
    return this.get(i)?.[prop];
  }

  item$(i?: number) {
    return isInt(i) ?
        this.items$.map((items) => items[i])
      : (fluxUndefined as Pipe<NBItem, NBItems>);
  }

  prop$<K extends BKeys>(i: number | undefined, prop: K): Pipe<BItem[K] | undefined, any> {
    return isInt(i) ?
        this.items$.map((items) => items[i]?.[prop])
      : (fluxUndefined as Pipe<BItem[K] | undefined, any>);
  }
}

export const BContext = createContext<BCtrl | undefined>(undefined);

export const useBCtrl = () => useContext(BContext)!;
