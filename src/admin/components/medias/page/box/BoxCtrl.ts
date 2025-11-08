import {
  Dictionary,
  flux,
  logger,
  fluxUnion,
  fluxDictionary,
  stopEvent,
  onHtmlEvent,
  Style,
  NextState,
  isFunction,
  Pipe,
} from 'fluxio';
import { ComponentType } from 'preact';
import { BoxFun, BoxData } from './boxTypes';
import { BoxCarousel } from './BoxCarousel';
import { PanZoomCtrl } from '@/components/PanZoom';
import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import { SCREEN_SIZES } from '../EditViewportControls';
import { fluxUndefined } from 'fluxio/flux/fluxUndefined';

const log = logger('BoxController');

export type BoxComponent = ComponentType<any> | string;

export interface BoxEvent {
  id?: string;
  type?: string;
  box?: BoxData;
  element?: HTMLElement;
  event?: Event;
  count?: number;
  timeStamp?: number;
}

export type A1 = 1 | 0 | -1;

export const getParents = (boxes: Dictionary<BoxData>) => {
  const parents: Dictionary<string> = {};
  for (const parentId in boxes) {
    const children = boxes[parentId]?.children;
    if (children) {
      for (const childId of children) {
        parents[childId] = parentId;
      }
    }
  }
  return parents;
};

export class BoxCtrl {
  readonly registry: Dictionary<BoxComponent> = {
    div: 'div',
    span: 'span',
    p: 'p',
    section: 'section',
    article: 'article',
    carousel: BoxCarousel,
  };
  readonly funs: Dictionary<(boxEvent: BoxEvent) => void> = {};

  readonly boxes = fluxDictionary<BoxData>();
  readonly elements = fluxDictionary<HTMLElement>();
  readonly parents = fluxDictionary(this.boxes.throttle(100).map(getParents));

  readonly el?: HTMLElement;
  readonly parentId?: string;

  readonly init$ = flux<BoxEvent>({});
  readonly click$ = flux<BoxEvent>({});
  readonly event$ = fluxUnion(this.init$, this.click$);

  readonly panZoom = new PanZoomCtrl();
  public handlesEl?: HTMLDivElement | null;

  constructor() {
    this.panZoom.ready$.on(() => {
      const element = this.panZoom.viewport();
      onHtmlEvent(element, 'click', (event) => {
        this.click$.set({ element, event });
      });

      const [w, h] = SCREEN_SIZES[0]!;
      this.panZoom.setSize(w, h);
    });
  }

  register(type: string, component: BoxComponent) {
    this.registry[type] = component;
  }

  funCall(fun: BoxFun | undefined, boxEvent: BoxEvent) {
    if (!fun) return;
    log.d('funCall', fun, boxEvent);
    if (fun.name) {
      this.funs[fun.name]?.(boxEvent);
    }
  }

  private newEvent(id: string, type: string, event?: Event): BoxEvent {
    const box = this.get(id);
    const element = this.getElement(id);
    return { id, box, element, type, event, timeStamp: Date.now() };
  }

  boxInit(id: string, element: HTMLElement) {
    const box = this.get(id);
    log.d('boxInit', id, element, box);
    if (!box) return;

    this.elements.setItem(id, element);

    const boxEvent = this.newEvent(id, 'init');

    log.d('boxInit event', boxEvent);
    this.funCall(box?.onInit, boxEvent);
    this.init$.set(boxEvent);
  }

  boxClick(id: string, event?: Event): void {
    const box = this.get(id);
    log.d('boxClick', id, event, box);

    stopEvent(event);

    const lastEvent = this.click$.get();
    const boxEvent = this.newEvent(id, 'click', event);
    boxEvent.count = (lastEvent.id === id ? lastEvent.count || 1 : 0) + 1;

    log.d('boxClick event', boxEvent);
    this.funCall(box?.onClick, boxEvent);
    this.click$.set(boxEvent);
  }

  getComp(type: string) {
    return (type && this.registry[type]) || 'div';
  }

  get(id?: string) {
    if (id) return this.boxes.getItem(id);
  }

  getElement(id?: string) {
    if (id) return this.elements.getItem(id);
  }

  getParentId(id?: string) {
    if (id) return this.parents.getItem(id);
  }

  set(id?: string, replace?: NextState<BoxData | undefined>) {
    if (!id) return;
    const prev = this.get(id);
    const next = isFunction(replace) ? replace(prev) : replace;
    this.boxes.setItem(id, next);
    return next;
  }

  update(id?: string, changes?: NextState<BoxData>) {
    if (!id) return;
    const prev = this.get(id);
    if (!prev) return;
    const value = isFunction(changes) ? changes(prev) : changes;
    if (!value) return;
    const next = { ...prev, ...value };
    this.boxes.setItem(id, next);
    return next;
  }

  setProp<K extends keyof BoxData>(id: string | undefined, prop: K, value: NextState<BoxData[K]>) {
    if (!id) return;
    const prev = this.get(id);
    if (!prev) return;
    const val = isFunction(value) ? value(prev[prop]) : value;
    const next = { ...prev, [prop]: val };
    this.boxes.setItem(id, next);
    return next;
  }

  getProp<K extends keyof BoxData>(id: string, prop: K) {
    return this.get(id)?.[prop];
  }

  get$(id?: string) {
    return id ?
        this.boxes.getItem$(id)
      : (fluxUndefined as Pipe<BoxData | undefined, Dictionary<BoxData>>);
  }

  getProp$<K extends keyof BoxData>(
    id: string | undefined,
    prop: K
  ): Pipe<BoxData[K] | undefined, any> {
    return id ?
        this.get$(id).map((box) => box?.[prop])
      : (fluxUndefined as Pipe<BoxData[K] | undefined, any>);
  }

  getElement$(id?: string) {
    return id ? this.elements.getItem$(id) : fluxUndefined;
  }

  getParentId$(id?: string) {
    return id ? this.parents.getItem$(id) : fluxUndefined;
  }
}

export const BoxContext = createContext<BoxCtrl | undefined>(undefined);

export const useBoxCtrl = () => useContext(BoxContext)!;
