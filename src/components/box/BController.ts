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
  isNotNil,
  getBit,
  serverDate,
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
import { BPlayer } from './BPlayer';
import { PanZoomController } from '@/components/common/PanZoom';
import { fluxUndefined } from 'fluxio/flux/fluxUndefined';
import {
  ALargeSmallIcon,
  EarthIcon,
  FileIcon,
  HomeIcon,
  ImagePlayIcon,
  SquareDashedMousePointerIcon,
} from 'lucide-react';
import { app } from '@/app';
import { BText } from './BText';
import { BPage } from './BPage';
import { BZone } from './BZone';
import { BRoot } from './BRoot';
import { BMedia } from './BMedia';
import { Api } from '@/api/Api';
import { Router } from '@/controllers/Router';
import { BWeb } from './BWeb';

export const RootIcon = HomeIcon;
export const PageIcon = FileIcon;
export const ZoneIcon = SquareDashedMousePointerIcon;
export const PlayerIcon = ImagePlayIcon;
export const MediaIcon = FileIcon;
export const TextIcon = ALargeSmallIcon;
export const WebIcon = EarthIcon;

export const rootType: BType = { comp: BRoot, label: 'Écran', r: 1, layout: 1, icon: RootIcon };
export const pageType: BType = { comp: BPage, label: 'Page', r: 1, layout: 1, icon: PageIcon };
export const zoneType: BType = { comp: BZone, label: 'Zone', r: 1, a: 1, layout: 1, icon: ZoneIcon };
export const playerType: BType = { comp: BPlayer, label: 'Player', r: 1, a: 1, icon: PlayerIcon };
export const mediaType: BType = { comp: BMedia, label: 'Media', m: 1, a: 1, icon: MediaIcon };
export const textType: BType = { comp: BText, label: 'Texte', b: 1, a: 1, icon: TextIcon };
export const webType: BType = { comp: BWeb, label: 'Vue Web', a: 1, icon: WebIcon };

export class BController {
  readonly log = logger('BController');
  readonly registry: Dictionary<BType> = {
    root: rootType,
    page: pageType,
    zone: zoneType,
    text: textType,
    web: webType,
    player: playerType,
    media: mediaType,
  };

  readonly funs: Dictionary<(boxEvent: BEvent) => void> = {};

  readonly items$ = flux<NBItems>([]);

  readonly el?: HTMLElement;
  readonly parentId?: string;

  readonly init$ = flux<BEvent>({});
  readonly click$ = flux<BEvent>({});
  readonly event$ = fluxUnion(this.init$, this.click$);

  readonly pages$ = this.items$.map((items) => items.filter((i) => i && i.t === 'page'));
  readonly page$ = this.pages$.map((pages) => pages.find((p) => this.check(p)));

  readonly panZoom = new PanZoomController();

  readonly api: Api;
  readonly router: Router;

  constructor(api: Api, router: Router) {
    this.api = api;
    this.router = router;
    app.b = this;
  }

  getDefaultType(d: BData) {
    return (
      d.b ? 'text'
      : d.m ? 'media'
      : 'rect'
    );
  }

  toItems(data: NBData[], items: Writable<NBItem>[] = []) {
    for (let i = 0, l = data.length; i < l; i++) {
      const d = data[i];
      if (!d) continue;

      items[i] = {
        ...d,
        t: d.t || this.getDefaultType(d),
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
  }

  toData(item: NBItem): NBData {
    if (!item) return null;
    const { i, p, e, ...d } = item;
    if (d.r?.length === 0) delete d.r;
    if (this.getDefaultType(d) === d.t) delete (d as Writable<BData>).t;
    return d;
  }

  applyChanges(items: Writable<NBItems>, index: number, prev: NBItem, next: NBItem) {
    this.log.d('applyChanges', index, 'prev:', prev, 'next:', next);

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
  }

  register(type: string, boxConfig: BType) {
    this.registry[type] = boxConfig;
  }

  getType(type: string | undefined) {
    return type ? this.registry[type] || zoneType : zoneType;
  }

  funCall(fun: BFun | undefined, boxEvent: BEvent) {
    if (!fun) return;
    this.log.d('funCall', fun, boxEvent);
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
    this.log.d('init', i, el, prev, 'prev.el:', prev?.e);
    if (!prev) return;

    const next = this.update(i, { e: el });
    const boxEvent = this.newEvent(i, 'init');

    this.log.d('init event', boxEvent, 'next.e:', next?.e);
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
    this.log.d('click', i, event, box);

    stopEvent(event);

    const lastEvent = this.click$.get();
    const boxEvent = this.newEvent(i, 'click', event);
    boxEvent.count = (lastEvent.i === i ? lastEvent.count || 1 : 0) + 1;
    boxEvent.item = box;

    this.log.d('click event', boxEvent, 'el:', boxEvent.el);
    this.funCall(box?.click, boxEvent);
    this.click$.set(boxEvent);
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

  getRoot() {
    return this.getItems()[0]!;
  }

  getParent(index?: number, filter: (item: BItem) => boolean = isNotNil): NBItem {
    if (!isUInt(index)) return;
    const items = this.getItems();
    let item = items[index];
    while (true) {
      if (!item) return;
      if (filter(item)) return item;
      item = item.p ? items[item.p] : undefined;
    }
  }

  getPage(index?: number): NBItem {
    return this.getParent(index, (p) => p.t === 'page');
  }

  getData(index?: number) {
    return this.toData(this.get(index));
  }

  getAllData() {
    return this.getItems().map((i) => this.toData(i));
  }

  setAllData(data: NBData[]) {
    this.log.d('setAllData', data);
    const items = this.toItems(data);
    if (!items.length) {
      items;
    }
    this.items$.set(items);
  }

  set(index?: number, replace?: BNext) {
    this.log.d('set', index, replace);
    if (!isUInt(index)) return;

    const items = this.getItems();

    const prev = items[index];

    const d = isFunction(replace) ? replace(prev) : replace;
    if (!d) return prev;

    const next: BItem = {
      ...d,
      t: d?.t || this.getDefaultType(d),
      p: d?.p || (index === 0 ? undefined : 0),
      r: uniq(d?.r || []),
      i: index,
    };

    const changes = prev && next && getChanges(prev, next);
    if (changes && isEmpty(changes)) return prev;

    this.log.d('set changes', index, changes);
    this.items$.set(this.applyChanges([...items], index, prev, next));

    return next;
  }

  setProp<K extends BKeys>(i: number | undefined, prop: K, value: BPropNext<K>) {
    this.log.d('setProp', i, prop, value);
    return this.set(i, (prev) => {
      if (!prev) return prev;
      const prevValue = prev[prop];
      const nextValue = isFunction(value) ? value(prevValue) : value;
      if (prevValue === nextValue) return prev;
      const next = { ...prev, [prop]: nextValue };
      return next;
    });
  }

  update(i?: number, changes?: BNext) {
    this.log.d('update', i, changes);
    return this.set(i, (prev) => {
      if (!prev) return prev;
      const results = isFunction(changes) ? changes(prev) : changes;
      if (isEmpty(results)) return prev;
      return { ...prev, ...results };
    });
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

  check(item?: NBItem) {
    if (!item || item.h) return false;

    const f = item.f;
    if (!f) return true;

    // PAGE

    const now = serverDate();

    // Check dates [start, end]
    if (f.d) {
      const currentDate = now.toISOString().split('T')[0]!; // Format: 'YYYY-MM-DD'
      const isInDateRange = f.d.some(([start, end]) => {
        return currentDate >= start && currentDate <= end;
      });
      if (!isInDateRange) return false;
    }

    // Check hours [start, end]
    if (f.h) {
      const currentHour = now.getHours() + now.getMinutes() / 60; // e.g., 13:30 = 13.5
      const isInHourRange = f.h.some(([start, end]) => {
        return currentHour >= start && currentHour < end;
      });
      if (!isInHourRange) return false;
    }

    // Check week days [sunday=0, monday=1, ..., saturday=6]
    if (f.w) {
      const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      if (!getBit(f.w, currentDay)) return false;
    }

    // Check device ID
    if (f.i) {
      const deviceId = this.router.deviceId$.get();
      if (deviceId && !f.i[deviceId]) return false;
    }

    return true;
  }
}
