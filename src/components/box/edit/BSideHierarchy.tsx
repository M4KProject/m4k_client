import { Css, truncate } from 'fluxio';
import { useFluxMemo } from '@/hooks/useFlux';
import { Square } from 'lucide-react';
import { useBEditController } from './useBEditController';
import { BField } from './BField';
import { tooltipProps } from '@/components/common/Tooltip';

const c = Css('BSideHierarchy', {
  '': {
    row: ['center', 'start'],
    cursor: 'pointer',
  },
  '-selected': {
    bold: 1,
    fg: 'primary',
  },
  Icon: {
    mr: 4,
  },
  Children: {
    col: ['start', 'start'],
    pl: 20,
  },
});

export const BSideHierarchy = ({ i }: { i: number }) => {
  const controller = useBEditController();
  const item = useFluxMemo(() => controller?.item$(i), [controller, i]);
  const selected = useFluxMemo(() => controller?.selectIndex$.map((s) => s === i), [controller, i]);
  const type = controller?.getType(item?.t);
  const Icon = type?.icon || Square;

  const label = truncate(item?.n || item?.b?.replace(/\*\*/g, '') || type?.label || '', 20);
  const children = item?.r;

  return (
    <>
      <div {...c('', selected && '-selected')} onClick={() => controller?.click(i)}>
        <div {...c('Icon')} {...tooltipProps(type?.label || '')}>
          <Icon />
        </div>
        {selected ?
          <BField prop="n" defaultValue={label} />
        : label}
      </div>
      {children && (
        <div {...c('Children')}>
          {children.map((child) => (
            <BSideHierarchy i={child} />
          ))}
        </div>
      )}
    </>
  );
};
