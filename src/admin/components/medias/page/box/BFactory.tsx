import { BCtrl, useBCtrl } from './BCtrl';
import { useFlux } from '@/hooks/useFlux';
import { BCompProps, BFactoryProps, BItem } from './bTypes';
import { computeStyle, Css, CssStyle, logger } from 'fluxio';
import { useMemo } from 'preact/hooks';

const log = logger('B');

const c = Css('B', {
  '': {
    position: 'absolute',
    col: 1,
    overflowX: 'hidden',
    overflowY: 'auto',
  },
});

const computeProps = (ctrl: BCtrl, item: BItem): BCompProps['props'] => {
  const { i, type, cls, style } = item;
  const cssStyle = computeStyle(style);
  const pos = item?.pos;
  if (pos) {
    const [x, y, w, h] = pos;
    cssStyle.position = 'absolute';
    cssStyle.left = `${x}%`;
    cssStyle.top = `${y}%`;
    cssStyle.width = `${w}%`;
    cssStyle.height = `${h}%`;
  }
  const props: BCompProps['props'] = {
    ...c('', `-${type}`, i, cls),
    style: cssStyle,
    onClick: ctrl.getClick(i),
    ref: ctrl.getRef(i),
  }
  log.d('computeProps', item, props);
  return props;
}

export const BFactory = ({ i }: BFactoryProps) => {
  log.d('BFactory', i);

  const ctrl = useBCtrl();
  const item = useFlux(ctrl.item$(i));
  const type = ctrl.getType(item?.type);
  const Comp = type.comp;
  const props = useMemo(() => item && computeProps(ctrl, item), [ctrl, item]);

  return item && props && !item.hide ? <Comp i={i} item={item} ctrl={ctrl} props={props} /> : null;
};
