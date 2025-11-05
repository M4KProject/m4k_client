import { ComponentChildren, createElement } from 'preact';
import { DivProps } from '@common/components';
import { computeStyle } from 'fluxio';
import { useEffect, useRef } from 'preact/hooks';
import { useBoxController } from './BoxController';
import { useFlux } from '@common/hooks';

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

export interface BoxProps {
  id: string;
}
export const Box = ({ id }: BoxProps) => {
  const ref = useRef<any>(null);
  const el = ref.current;
  const ctrl = useBoxController();
  const item = useFlux(ctrl.get$(id));

  useEffect(() => {
    if (el) {
      ctrl.boxInit(id, el);
    }
  }, [id, el]);

  if (!item) return null;
  if (item.hide) return null;

  const type = item.type || 'div';
  const Comp = ctrl.getComp(type);

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
    id,
    ref,
  };

  props.onClick = (event) => {
    console.debug('onClick', event);
    ctrl.boxClick(id, event);
  };

  const children: ComponentChildren[] = [];

  if (item.children) {
    for (const childId of item.children) {
      children.push(<Box key={childId} id={childId} />);
    }
  }

  if (item.text) {
    children.push(item.text);
  }

  console.debug('render', id, item, ctrl, props, children);

  return createElement(Comp, props, ...children);
};
