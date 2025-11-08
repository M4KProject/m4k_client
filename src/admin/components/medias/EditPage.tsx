import { Css } from 'fluxio';
import { JobGrid } from '../jobs/JobGrid';
import { EditViewport } from './page/EditViewport';
import { EditSide } from './page/EditSide';
import { useEffect, useMemo } from 'preact/hooks';
import { BoxContext, BoxCtrl } from './page/box/BoxCtrl';
import { PageModel } from '@/api/models';
import { sideOpen$ } from '@/components/Side';

const c = Css('EditPage', {
  '': {
    row: 'stretch',
    flex: 1,
  },
});

export const EditPage = ({ page }: { page: PageModel }) => {
  const ctrl = useMemo(() => new BoxCtrl(), []);

  useEffect(() => {
    ctrl.set('aaa', {
      pos: [10, 10, 30, 10],
      style: { bg: '#0000FF', fg: '#AAAAFF', center: 1 },
      text: 'Ma **BOX** aaa',
    });
    ctrl.set('bbb', {
      pos: [20, 18, 50, 10],
      style: { bg: '#00FF00AA', fg: '#FF0000', col: ['end', 'end'] },
      text: 'Ma **BOX** bbb',
    });
    ctrl.set('root', {
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
      <BoxContext.Provider value={ctrl}>
        <EditViewport />
        <EditSide />
      </BoxContext.Provider>
      <JobGrid filter={(job) => job.status !== 'finished'} panel={true} />
    </div>
  );
};
