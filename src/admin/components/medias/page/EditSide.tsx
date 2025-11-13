import { Css } from 'fluxio';
import { EditMedias } from './EditMedias';
import { EditHierarchy } from './EditHierarchy';
import { EditProps } from './EditProps';
import { TabPanel } from '@/components/TabPanel';

const c = Css('EditSide', {
  '': {
    position: 'relative',
    elevation: 2,
    w: 300,
    h: '100%',
    zIndex: 10,
  },
  Content: {
    position: 'absolute',
    p: 4,
    wh: '100%',
    bg: 'bg',
    overflowX: 'hidden',
    overflowY: 'auto',
    col: 1,
  }
});

export const EditSide = () => {
  return (
    <div {...c()}>
      <TabPanel
        {...c('Content')}
        tabs={[
          ['Propriétés', <EditProps />],
          ['Hiérarchie', <EditHierarchy />],
          ['Medias', <EditMedias />],
        ]}
      />
    </div>
  );
};
