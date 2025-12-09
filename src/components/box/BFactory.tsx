import { BController } from './BController';
import { useFluxMemo } from '@/hooks/useFlux';
import { BCompProps, BFactoryProps, BItem } from './bTypes';
import { computeStyle, Css, logger } from 'fluxio';
import { useMemo } from 'preact/hooks';
import { useBController } from './useBController';
import { AnimState, useAnimState } from '@/hooks/useAnimState';

const log = logger('B');

const c = Css('B', {
  '': {
    position: 'relative',
    overflowX: 'hidden',
    overflowY: 'auto',
    boxSizing: 'border-box',
  },
});

const computeProps = (
  controller: BController,
  item: BItem,
  animState: AnimState
): BCompProps['props'] => {
  const { i, c: cls, s } = item;
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
    ...c('', String(i), `-${animState}`, cls),
    style,
    onClick: controller.getClick(i),
    ref: controller.getRef(i),
  };

  log.d('computeProps', item, props);
  return props;
};

export const BFactory = ({ i }: BFactoryProps) => {
  log.d('BFactory', i);

  const controller = useBController();
  const item = useFluxMemo(() => controller?.item$(i), [controller, i]);

  const show = controller ? controller.check(item) : false;
  const animState = useAnimState(show, 0.5);

  if (!controller) return null;

  const type = controller.getType(item?.t);
  const Comp = type.comp;

  if (animState === 'unmounted') return null;

  const props = useMemo(
    () => controller && item && computeProps(controller, item, animState),
    [controller, item, animState]
  );

  return item && props ? <Comp i={i} item={item} props={props} /> : null;
};
