import { Css, logger, truncate } from 'fluxio';
import { useFluxMemo } from '@/hooks/useFlux';
import { Square } from 'lucide-react';
import { useBEditController } from './useBEditController';
import { BField, BFieldSep } from './BField';
import { tooltipProps } from '@/components/common/Tooltip';

const log = logger('BSideHierarchy');

const c = Css('BSideHierarchy', {
  '': {
    col: ['stretch', 'start'],
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

const BSideHierarchyItem = ({ i }: { i: number }) => {
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
        <div {...c('Icon')} {...tooltipProps(type?.label || '')}>
          <Icon />
        </div>
        {selected ? (
          <BField prop="n" defaultValue={label} />
        ) : (
          label
        )}
      </div>
      {children && (
        <div {...c('Children')}>
          {children.map((child) => (
            <BSideHierarchyItem i={child} />
          ))}
        </div>
      )}
    </>
  );
};

export const BSideHierarchy = () => {
  log.d('BSideHierarchy');

  return (
    <div {...c('')}>
      <BSideHierarchyItem i={0} />
    </div>
  );
};
