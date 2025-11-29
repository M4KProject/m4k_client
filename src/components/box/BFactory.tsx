import { BController } from './BController';
import { useFluxMemo } from '@/hooks/useFlux';
import { BCompProps, BFactoryProps, BItem } from './bTypes';
import { computeStyle, Css, logger } from 'fluxio';
import { useMemo } from 'preact/hooks';
import { useBController } from './useBController';

const log = logger('B');

const c = Css('B', {
  '': {
    position: 'relative',
    overflowX: 'hidden',
    overflowY: 'auto',
    boxSizing: 'border-box',
  },
});

const computeProps = (ctrl: BController, item: BItem): BCompProps['props'] => {
  const { i, t, c: cls, s } = item;
  const style = computeStyle(s);
  const a = item?.a;

  if (a) {
    const [x, y, w, h] = a;
    style.position = 'absolute';
    style.left = `${x}%`;
    style.top = `${y}%`;
    style.width = `${w}%`;
    style.height = `${h}%`;
  }

  const props: BCompProps['props'] = {
    ...c('', String(i), cls),
    style,
    onClick: ctrl.getClick(i),
    ref: ctrl.getRef(i),
  };

  log.d('computeProps', item, props);
  return props;
};

export const BFactory = ({ i }: BFactoryProps) => {
  log.d('BFactory', i);

  const controller = useBController();
  const item = useFluxMemo(() => controller.item$(i), [controller, i]);
  const type = controller.getType(item?.t);
  const Comp = type.comp;
  const props = useMemo(() => item && computeProps(controller, item), [controller, item]);

  return item && props ? <Comp i={i} item={item} props={props} /> : null;
};
