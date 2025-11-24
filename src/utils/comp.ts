import { isFunction } from 'fluxio';
import { ComponentChildren, ComponentType, createElement } from 'preact';

export type Comp = null | undefined | ComponentChildren | ComponentType<any>;

export const comp = (content: Comp): ComponentChildren =>
  isFunction(content) ? createElement(content, {}) : content || null;
