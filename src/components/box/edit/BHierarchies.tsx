import { Css, logger, truncate } from 'fluxio';
import { useFluxMemo } from '@/hooks/useFlux';
import { Square } from 'lucide-react';
import { useBEditController } from './useBEditController';

const log = logger('BHierarchy');

const c = Css('BHierarchy', {
  '': {
    flex: 1,
    overflowX: 'hidden',
    overflowY: 'auto',
    col: ['stretch', 'start'],
    p: 8,
  },
  Item: {
    row: ['center', 'start'],
    cursor: 'pointer',
  },
  Children: {
    col: ['start', 'start'],
    pl: 20,
  },
  Icon: {
    mr: 4,
  },
  'Item-selected': {
    bold: 1,
    fg: 'p',
  },
});

const BHierarchyItem = ({ i }: { i: number }) => {
  const controller = useBEditController();
  const item = useFluxMemo(() => controller?.item$(i), [controller, i]);
  const selected = useFluxMemo(() => controller?.select$.map((e) => e.i === i), [controller, i]);
  const type = controller?.getType(item?.t);
  const Icon = type?.icon || Square;

  const label = truncate(item?.n || item?.b?.replace(/\*\*/g, '') || type?.label || '', 20);
  const children = item?.r;

  return (
    <>
      <div {...c('Item', selected && 'Item-selected')} onClick={() => controller?.click(i)}>
        <div {...c('Icon')}>
          <Icon />
        </div>
        {label}
      </div>
      {children && (
        <div {...c('Children')}>
          {children.map((child) => (
            <BHierarchyItem i={child} />
          ))}
        </div>
      )}
    </>
  );
};

export const BHierarchies = () => {
  log.d('BHierarchies');

  return (
    <div {...c('')}>
      <BHierarchyItem i={0} />
    </div>
  );
};
