import { Css, truncate } from 'fluxio';
import { useFluxMemo } from '@/hooks/useFlux';
import { ChevronRightIcon, Square } from 'lucide-react';
import { useBEditController } from '../useBEditController';
import { BField } from '../BField';
import { tooltipProps } from '@/components/common/Tooltip';
import { useState } from 'preact/hooks';

const c = Css('BSideNode', {
  '': {
    position: 'relative',
    row: ['center', 'start'],
    cursor: 'pointer',
    h: 28,
  },
  '-selected': {
    bold: 1,
    fg: 'primary',
  },
  Icon: {
    mr: 4,
    center: 1,
  },
  Children: {
    col: ['start', 'start'],
    pl: 20,
  },
  Chevron: {
    position: 'absolute',
    h: '100%',
    center: 1,
    x: -15,
  },
  'Chevron svg': {
    wh: 15,
    transition: 0.2,
  },
  '-open &Chevron svg': {
    rotate: '90deg',
  },
});

export const BSideNode = ({ i }: { i: number }) => {
  const controller = useBEditController();
  const item = useFluxMemo(() => controller.item$(i), [controller, i]);
  const selectId$ = controller.selectId$;
  const selected = useFluxMemo(() => selectId$.map((s) => s === i), [selectId$, i]);
  const type = controller.getType(item?.t);
  const Icon = type?.icon || Square;
  const label = truncate(item?.n || item?.b?.replace(/\*\*/g, '') || type?.label || '', 20);
  const children = item?.r;
  const [open, setOpen] = useState(false);
  const isRoot = item?.t === 'root';
  const hasChildren = children && children.length;

  return (
    <>
      <div
        {...c('', selected && '-selected', children && '-children', open && '-open')}
        onClick={() => {
          controller.click(i);
          setOpen((p) => !p);
        }}
      >
        {!isRoot && hasChildren ?
          <div {...c('Chevron')}>
            <ChevronRightIcon />
          </div>
        : null}
        <div {...c('Icon')} {...tooltipProps(type?.label || '')}>
          <Icon />
        </div>
        {selected ?
          <BField prop="n" defaultValue={label} />
        : label}
      </div>
      {hasChildren && (isRoot || open) ?
        <div {...c('Children')}>
          {children.map((child) => (
            <BSideNode key={child} i={child} />
          ))}
        </div>
      : null}
    </>
  );
};
