import { Grid, GridCols } from '@/components/Grid';
import { Css } from 'fluxio';
import { BoxHierarchy, BoxItem } from './box/boxTypes';
import { useBoxCtrl } from './box/BoxCtrl';
import { useFlux } from '@/hooks/useFlux';

const c = Css('EditHierarchy', {
  '': {
    flex: 1,
    col: 1,
    elevation: 1,
    m: 4,
  },
  Title: {

  },
  'Title-selected': {
    bold: 1,
    fg: 'p',
  },
});

interface HierarchyCtx {
  select?: BoxItem;
  click: (i: number) => void;
}

const cols: GridCols<BoxHierarchy, HierarchyCtx> = {
  title: [
    'Titre',
    ({ i, item: { name }, depth }, { select, click }) => (
      <div {...c('Title', select?.i === i && 'Title-selected')} style={{ marginLeft: 24 * depth }} onClick={() => click(i)}>
        {/* <MediaIcon
          type={type}
          isOpen={getIsOpen(id)}
          hasChildren={type === 'folder' && getChildren(id).length > 0}
        /> */}
        {name||`Box${i}`}
      </div>
    ),
  ],
};

export const EditHierarchy = () => {
  const ctrl = useBoxCtrl();
  const hierarchies = useFlux(ctrl.hierarchies$);
  const select = useFlux(ctrl.click$);

  const ctx: HierarchyCtx = {
    select: select.item,
    click: (i: number) => {
      ctrl.boxClick(i)
    }
  };

  return (
    <div {...c()}>
      <Grid ctx={ctx} cols={cols} items={hierarchies} />
    </div>
  );
};
