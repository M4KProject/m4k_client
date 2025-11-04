import { Dictionary, logger } from "fluxio";
import { ComponentType } from "preact";
import { BoxFun, BoxItem } from "./boxTypes";
import { BoxCarousel } from "./BoxCarousel";

const log = logger('BoxController');

export type BoxComponent = ComponentType<any> | string;

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

  register(type: string, component: BoxComponent) {
    this.registry[type] = component;
  }

  call(id: string, fun: BoxFun, event?: Event) {
    log.d('call', id, fun, event);
  }

  initItem(id: string, el: HTMLElement) {
    const item = this.items[id];
    if (!item) return;

    this.els[id] = el;

    if (item.onInit) {
      this.call(id, item.onInit);
    }
  }
}