import { Grid, GridCols } from '@/components/Grid';
import { Css, groupBy, isInt, logger, Writable } from 'fluxio';
import { BoxHierarchies, BoxHierarchy, BoxItem, BoxItems } from './box/boxTypes';
import { BoxCtrl, useBoxCtrl } from './box/BoxCtrl';
import { useFlux, useFluxMemo } from '@/hooks/useFlux';

const log = logger('EditHierarchy');

const c = Css('EditHierarchy', {
  '': {
    flex: 1,
    col: 1,
    elevation: 1,
    m: 4,
  },
  Item: {
    row: ['center', 'start'],
    cursor: 'pointer',
  },
  Icon: {
    mr: 4,
  },
  'Item-selected': {
    bold: 1,
    fg: 'p',
  },
});

const EditHierarchyItem = ({ hierarchy }: { hierarchy: BoxHierarchy }) => {
  const { i, item, depth } = hierarchy;
  const { name, text, type } = item;
  const ctrl = useBoxCtrl();
  const selected = useFluxMemo(() => ctrl.click$.map(click => click.i === i), [ctrl, i]);
  const config = ctrl.getType(type);
  const Icon = config.icon;

  return (
    <div
      {...c('Item', selected && 'Item-selected')}
      style={{ marginLeft: 24 * depth }}
      onClick={() => ctrl.click(i)}
    >
      <Icon {...c('Icon')} />
      {/* <MediaIcon
        type={type}
        isOpen={getIsOpen(id)}
        hasChildren={type === 'folder' && getChildren(id).length > 0}
      /> */}
      {name||`Box${i}`}
    </div>
  )
}

const computeHierarchies = (items: BoxItems): BoxHierarchies => {
  const hierarchies: Writable<BoxHierarchy>[] = [];

  for (let i=0,l=items.length; i<l; i++) {
    const item = items[i];
    if (item) hierarchies[i] = { i, depth: 0, children: [], item };
  }

  const childrenByIndex = groupBy(hierarchies, item => item.parent?.i);
  for (let i=0,l=hierarchies.length; i<l; i++) {
    const h = hierarchies[i]!;
    const parentIndex = h.item.parent;
    h.parent = isInt(parentIndex) ? hierarchies[parentIndex] : undefined;
    h.children = childrenByIndex[i] || [];
  }

  const getDepth = (h: Writable<BoxHierarchy>): number => {
    if (h.depth !== 0) return h.depth;
    if (!h.parent) return 0;
    return h.depth = (getDepth(h.parent) + 1);
  }
  for (let i=0,l=hierarchies.length; i<l; i++) {
    const h = hierarchies[i]!;
    h.depth = getDepth(h);
  }

  log.d('computeHierarchies', items, hierarchies);

  return hierarchies;
}

export const EditHierarchy = () => {
  const ctrl = useBoxCtrl();
  const items = useFlux(ctrl.items$);
  const hierarchies = computeHierarchies(items);

  log.d('render', items, hierarchies);

  return (
    <div {...c()}>
      {(hierarchies||[]).map((hierarchy, i) => (
        <EditHierarchyItem key={i} hierarchy={hierarchy} />
      ))}
    </div>
  );
};
