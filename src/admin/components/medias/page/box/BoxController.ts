import { fluxCombine, Dictionary, flux, glb, logger, fluxUnion, fluxDictionary, fluxStored, isDictionaryOfItem } from 'fluxio';
import { ComponentType, JSX } from 'preact';
import { BoxFun, BoxItem } from './boxTypes';
import { BoxCarousel } from './BoxCarousel';

const log = logger('BoxController');

export type BoxComponent = ComponentType<any> | string;

export interface BoxEvent {
  id?: string;
  item?: BoxItem;
  event?: Event;
  el?: HTMLElement;
};

export class BoxController {
  private readonly items = fluxDictionary<BoxItem>();
  private readonly els = fluxDictionary<HTMLElement>();
  private readonly registry: Dictionary<BoxComponent> = {
    div: 'div',
    span: 'span',
    p: 'p',
    section: 'section',
    article: 'article',
    carousel: BoxCarousel,
  };
  readonly funs: Dictionary<(boxEvent: BoxEvent) => void> = {};
  readonly init$ = flux<BoxEvent>({});
  readonly click$ = flux<BoxEvent>({});
  readonly event$ = fluxUnion(this.init$, this.click$);

  register(type: string, component: BoxComponent) {
    this.registry[type] = component;
  }

  funCall(fun: BoxFun, boxEvent: BoxEvent) {
    log.d('call', fun, boxEvent);
    if (fun.name) {
      this.funs[fun.name]?.(boxEvent);
    }
  }

  boxInit(id: string, el: HTMLElement) {
    const item = this.get(id);
    log.d('onInit', id, el, item);

    this.els.setItem(id, el);

    const boxEvent: BoxEvent = { id, item, el };
    this.init$.set(boxEvent);

    if (item?.onInit) {
      this.funCall(item.onInit, boxEvent);
    }
  }

  boxClick(id: string, event?: Event): void {
    const item = this.get(id);
    log.d('onClick', id, event, item);

    const el = this.getEl(id);
    const boxEvent: BoxEvent = { id, item, event, el };
    this.click$.set(boxEvent);

    if (item?.onClick) {
      this.funCall(item.onClick, boxEvent);
    }
  }

  getComp(type: string) {
    return (type && this.registry[type]) || 'div';
  }

  getEl(id: string) {
    return this.els.getItem(id);
  }

  get(id: string) {
    return this.items.getItem(id);
  }

  get$(id: string) {
    return this.items.getItem$(id);
  }

  set(id: string, item: BoxItem) {
    return this.items.setItem(id, item);
  }

  update(id: string, changes: BoxItem) {
    return this.set(id, { ...this.get(id), ...changes });
  }
}
