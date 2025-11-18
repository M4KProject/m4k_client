import { Css, logger, truncate } from 'fluxio';
import { useBCtrl } from '@/box/BCtrl';
import { useFluxMemo } from '@/hooks/useFlux';
import { Square } from 'lucide-react';

const log = logger('BHierarchy');

const c = Css('BHierarchy', {
  '': {
    flex: 1,
    m: 4,
    overflowX: 'hidden',
    overflowY: 'auto',
    col: ['stretch', 'start'],
    bb: 'border',
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
  const ctrl = useBCtrl();
  const item = useFluxMemo(() => ctrl.item$(i), [ctrl, i]);
  const selected = useFluxMemo(() => ctrl.select$.map((e) => e.i === i), [ctrl, i]);
  const type = ctrl.getType(item?.t);
  const Icon = type.icon || Square;

  const label = truncate(item?.n || item?.b?.replace(/\*\*/g, '') || type.label || '', 20);
  const children = item?.r;

  // const { i, item, depth } = hierarchy;
  // const { name, text, type } = item;
  // const ctrl = useBCtrl();
  // const selected = useFluxMemo(() => ctrl.select$.map(e => e.i === i), [ctrl, i]);
  // const config = ctrl.getType(type);
  // const Icon = config.icon;

  return (
    <>
      <div {...c('Item', selected && 'Item-selected')} onClick={() => ctrl.click(i)}>
        <div {...c('Icon')}>
          <Icon />
        </div>
        {/* <MediaIcon
          type={type}
          isOpen={getIsOpen(id)}
          hasChildren={type === 'folder' && getChildren(id).length > 0}
        /> */}
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

// const getHierarchyDepth = (h: Writable<BHierarchy>): number => {
//   if (h.depth !== 0) return h.depth;
//   if (!h.parent) return 0;
//   return h.depth = (getHierarchyDepth(h.parent) + 1);
// }

// const computeHierarchies = (items: BItems): Readonly<BHierarchy[]> => {
//   const hierarchies: Writable<BHierarchy>[] = [];

//   for (let i=0,l=items.length; i<l; i++) {
//     const item = items[i];
//     if (item) hierarchies[i] = { i, depth: 0, children: [], item };
//   }

//   const childrenByIndex = groupBy(hierarchies, item => item.parent?.i);
//   for (let i=0,l=hierarchies.length; i<l; i++) {
//     const h = hierarchies[i]!;
//     const parentIndex = h.item.parent;
//     h.parent = isInt(parentIndex) ? hierarchies[parentIndex] : undefined;
//     h.children = childrenByIndex[i] || [];
//   }

//   for (let i=0,l=hierarchies.length; i<l; i++) {
//     const h = hierarchies[i]!;
//     h.depth = getHierarchyDepth(h);
//   }

//   log.d('computeHierarchies', items, hierarchies);

//   return hierarchies;
// }

export const BHierarchies = () => {
  // const ctrl = useBCtrl();
  // const items = useFlux(ctrl.items$);
  // const hierarchies = computeHierarchies(items);

  // log.d('render', items, hierarchies);

  log.d('BHierarchies');

  return (
    <div {...c()}>
      <BHierarchyItem i={0} />
      {/* {(hierarchies||[]).filter(h => h && h.item).map((hierarchy, i) => (
        <BHierarchyItem key={i} hierarchy={hierarchy} />
      ))} */}
    </div>
  );
};
