import { fluxCombine, Dictionary, flux, glb, logger, fluxUnion } from 'fluxio';
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
  items: Dictionary<BoxItem> = {};
  registry: Dictionary<BoxComponent> = {
    div: 'div',
    span: 'span',
    p: 'p',
    section: 'section',
    article: 'article',
    carousel: BoxCarousel,
  };
  els: Dictionary<HTMLElement> = {};
  static current: BoxController;

  funs: Dictionary<(boxEvent: BoxEvent) => void> = {};

  init$ = flux<BoxEvent>({});
  click$ = flux<BoxEvent>({});
  event$ = fluxUnion(this.init$, this.click$);

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
    const item = this.items[id];
    log.d('onInit', id, el, item);

    this.els[id] = el;

    const boxEvent: BoxEvent = { id, item, el };
    this.init$.set(boxEvent);

    if (item?.onInit) {
      this.funCall(item.onInit, boxEvent);
    }
  }

  boxClick(id: string, event?: Event): void {
    const item = this.items[id];
    log.d('onClick', id, event, item);

    const el = this.els[id];
    const boxEvent: BoxEvent = { id, item, event, el };
    this.click$.set(boxEvent);

    if (item?.onClick) {
      this.funCall(item.onClick, boxEvent);
    }
  }
}
