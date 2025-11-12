import { ComponentChildren, createElement } from 'preact';
import { computeStyle, Css, logger } from 'fluxio';
import { useEffect, useRef } from 'preact/hooks';
import { BoxConfig, useBoxCtrl } from './BoxCtrl';
import { useFlux } from '@/hooks/useFlux';
import { DivProps } from '@/components/types';

const log = logger('Box');

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

const c = Css('Box', {
  '': {
    position: 'absolute',
    col: 1,
    overflowX: 'hidden',
    overflowY: 'auto',
  },
})

export interface BoxProps {
  i: number;
}
export const Box = ({ i }: BoxProps) => {
  const ref = useRef<any>(null);
  const el = ref.current;
  const ctrl = useBoxCtrl();
  const item = useFlux(ctrl.item$(i));

  useEffect(() => {
    if (el) {
      ctrl.init(i, el);
    }
  }, [i, el]);

  if (!item) return null;
  if (item.hide) return null;

  const type = item.type || 'rect';
  const boxConfig = ctrl.registry[type] || {} as Partial<BoxConfig>;
  const Comp = boxConfig.comp || 'div';

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
    ...c('', `-${type}`, item),
    style,
    id: 'Box'+i,
    ref,
  };

  props.onClick = (event) => {
    log.d('onClick', i, event, el);
    ctrl.click(i, event);
  };

  const children: ComponentChildren[] = [];

  if (item.children) {
    for (const c of item.children) {
      children.push(<Box key={c} i={c} />);
    }
  }

  if (item.text) {
    const parts = item.text.matchAll(/\*\*(?<b>.+?)\*\*|(?<n>\n)|(?<t>[^*\n]+)/g);
    for (const { groups } of parts) {
      const { b, n, t } = groups!;
      if (b) {
        children.push(<b>{b}</b>);
      } else if (n) {
        children.push(<br/>);
      } else if (t) {
        children.push(t);
      }
    }
  }

  log.d('render', i, item, el, ctrl, props, children);

  return (boxConfig.render || createElement)(Comp, props, ...children);
};
