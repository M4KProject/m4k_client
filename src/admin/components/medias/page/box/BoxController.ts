import {
  Dictionary,
  flux,
  logger,
  fluxUnion,
  fluxDictionary,
  stopEvent,
  getChanges,
  groupBy,
  removeItem,
} from 'fluxio';
import { ComponentType } from 'preact';
import { BoxFun, BoxData } from './boxTypes';
import { BoxCarousel } from './BoxCarousel';
import { PanZoomController } from '@/components/medias/PanZoom';
import { createContext } from 'preact';
import { useContext } from 'preact/hooks';

const log = logger('BoxController');

export type BoxComponent = ComponentType<any> | string;

export interface BoxEvent {
  id?: string;
  type?: string;
  box?: BoxData;
  element?: HTMLElement;
  event?: Event;
  count?: number;
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

export class BoxController {
  private readonly registry: Dictionary<BoxComponent> = {
    div: 'div',
    span: 'span',
    p: 'p',
    section: 'section',
    article: 'article',
    carousel: BoxCarousel,
  };
  readonly funs: Dictionary<(boxEvent: BoxEvent) => void> = {};

  private readonly boxes = fluxDictionary<BoxData>();
  private readonly elements = fluxDictionary<HTMLElement>();
  private readonly parents = fluxDictionary(this.boxes.throttle(100).map(getParents));

  readonly el?: HTMLElement;
  readonly parentId?: string;

  readonly init$ = flux<BoxEvent>({});
  readonly click$ = flux<BoxEvent>({});
  readonly event$ = fluxUnion(this.init$, this.click$);
  readonly panZoom$ = flux<PanZoomController | undefined>(undefined);

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
    return { id, box, element, type, event };
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
    return id ? this.boxes.getItem(id) : undefined;
  }

  getElement(id: string) {
    return this.elements.getItem(id);
  }

  getParentId(id: string) {
    return this.parents.getItem(id);
  }

  update(id: string, changes: BoxData, replace: boolean = false) {
    if (replace) {
      this.boxes.setItem(id, changes);
      return changes;
    } else {
      const prev = this.get(id);
      const next = { ...prev, ...changes };
      this.boxes.setItem(id, next);
      return next;
    }
  }

  get$(id: string) {
    return this.boxes.getItem$(id);
  }

  getElement$(id: string) {
    return this.elements.getItem$(id);
  }

  getParentId$(id: string) {
    return this.parents.getItem$(id);
  }
}

export const BoxContext = createContext<BoxController | undefined>(undefined);

export const useBoxController = () => useContext(BoxContext)!;
