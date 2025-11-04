import { ComponentChildren, ComponentType, createElement, VNode } from 'preact';
import { DivProps } from '@common/components';
import { computeStyle, logger } from 'fluxio';
import { BoxItem } from './boxTypes';
import { useEffect, useRef } from 'preact/hooks';
import { BoxController } from './BoxController';

export interface BoxFactoryProps<T = any> {
  type: string;
  props: T;
}

// export interface WBoxData {
//   mediaId?: string;

//   // Carousel
//   delay?: number;
//   duration?: number;

//   // Filter
//   page?: string;
//   category?: string;
//   tags?: string;

//   // Data
//   data?: Dictionary<string>;
// }

export const Box = ({
  id,
  item,
  ctrl,
}: {
  id: string;
  item: BoxItem;
  ctrl: BoxController;
}): VNode<any> | null => {
  const ref = useRef<HTMLElement>(null);
  const el = ref.current;

  useEffect(() => {
    if (el) {
      ctrl.initItem(id, el);
    }
  }, [id, el]);

  const type = item.type || 'div';
  if (item.hide) return null;

  const Component = ctrl.registry[type] || 'div';

  const style = computeStyle(item.style);
  if (item.pos) {
    const [x, y, w, h] = item.pos;
    style.position = 'absolute';
    style.left = `${x}%`;
    style.top = `${y}%`;
    style.width = `${w}%`;
    style.height = `${h}%`;
  }

  const props: DivProps = {
    class: item.cls ? `Box Box-${type} ${item.cls}` : `Box Box-${type}`,
    style,
    ...item.props,
    ['data-id' as any]: id,
  };

  if (item.html) {
    props.dangerouslySetInnerHTML = { __html: item.html };
  }

  const onClick = item.onClick;
  if (onClick) {
    props.onClick = (event) => ctrl.call(id, onClick, event);
  }

  const children: ComponentChildren[] = [];

  if (item.children) {
    for (const childId of item.children) {
      const child = ctrl.items[childId];
      if (child) {
        children.push(<Box key={childId} id={childId} item={child} ctrl={ctrl} />);
      }
    }
  }

  console.debug('render', id, item, ctrl, props, children);

  return createElement(Component, props, ...children);
};
