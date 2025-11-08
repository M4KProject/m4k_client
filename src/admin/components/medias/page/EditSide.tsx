import { Css } from 'fluxio';
import { EditMedias } from './EditMedias';
import { EditHierarchy } from './EditHierarchy';
import { EditProps } from './EditProps';
import { TabPanel } from '@/components/TabPanel';

const c = Css('EditSide', {
  '': {
    position: 'relative',
    elevation: 2,
    borderLeft: 'g3',
    p: 4,
    w: 300,
    bg: 'b0',
    zIndex: 10,
    col: 1,
  },
});

export const EditSide = () => {
  return (
    <TabPanel
      {...c()}
      tabs={[
        ['Propriétés', <EditProps />],
        ['Hiérarchie', <EditHierarchy />],
        ['Medias', <EditMedias />],
      ]}
    />
  );
};
