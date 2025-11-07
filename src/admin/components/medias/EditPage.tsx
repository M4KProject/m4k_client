import { PageModel } from '@/api';
import { Css } from 'fluxio';
import { JobGrid } from '../jobs/JobGrid';
import { EditViewport } from './page/EditViewport';
import { EditSide } from './page/EditSide';
import { useEffect, useMemo } from 'preact/hooks';
import { sideOpen$ } from '@common/components';
import { BoxContext, BoxCtrl } from './page/box/BoxCtrl';

const c = Css('EditPage', {
  '': {
    row: 'stretch',
    flex: 1,
  },
});

export const EditPage = ({ page }: { page: PageModel }) => {
  const boxController = useMemo(() => new BoxCtrl(), []);

  useEffect(() => {
    boxController.update('aaa', {
      pos: [10, 10, 10, 10],
      style: { bg: '#0000FF' },
    });
    boxController.update('bbb', {
      pos: [20, 10, 10, 10],
      style: { bg: '#00FF00' },
    });
    boxController.update('root', {
      children: ['aaa', 'bbb'],
      style: {
        bg: '#00FFFF',
        wh: '100%',
      },
    });
  }, []);

  useEffect(() => {
    sideOpen$.set(false);
    return () => {
      sideOpen$.set(true);
    };
  }, []);

  return (
    <div {...c()}>
      <BoxContext.Provider value={boxController}>
        <EditViewport />
        <EditSide />
      </BoxContext.Provider>
      <JobGrid filter={(job) => job.status !== 'finished'} panel={true} />
    </div>
  );
};
