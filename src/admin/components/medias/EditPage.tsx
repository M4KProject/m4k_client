import { Css } from 'fluxio';
import { JobGrid } from '../jobs/JobGrid';
import { EditViewport } from './page/EditViewport';
import { EditSide } from './page/EditSide';
import { useEffect, useMemo } from 'preact/hooks';
import { BContext, BCtrl } from './page/box/BCtrl';
import { PageModel } from '@/api/models';
import { sideOpen$ } from '@/components/Side';

const c = Css('EditPage', {
  '': {
    row: 'stretch',
    flex: 1,
  },
});

export const EditPage = ({ page }: { page: PageModel }) => {
  const ctrl = useMemo(() => new BCtrl(), []);

  useEffect(() => {
    ctrl.setAllData([
      {
        style: { bg: "#00FFFF", wh: "100%" },
        children: [1, 2]
      },
      {
        pos: [10, 10, 30, 10],
        style: { bg: "#0000FF", fg: "#AAAAFF", center: 1 },
        text: "Ma **BOX** aaa"
      },
      {
        pos: [20, 18, 50, 10],
        style: { bg: "#00FF00AA", fg: "#FF0000", col: ["end", "end"] },
        text: "Ma **BOX** bbb"
      }
    ])
    // ctrl.set('root', {
    //   style: {
    //     bg: '#00FFFF',
    //     wh: '100%',
    //   },
    // });
    // ctrl.set('aaa', {
    //   parent: 'root',
    //   pos: [10, 10, 30, 10],
    //   style: { bg: '#0000FF', fg: '#AAAAFF', center: 1 },
    //   text: 'Ma **BOX** aaa',
    // });
    // ctrl.set('bbb', {
    //   parent: 'root',
    //   pos: [20, 18, 50, 10],
    //   style: { bg: '#00FF00AA', fg: '#FF0000', col: ['end', 'end'] },
    //   text: 'Ma **BOX** bbb',
    // });
  }, []);

  useEffect(() => {
    sideOpen$.set(false);
    return () => {
      sideOpen$.set(true);
    };
  }, []);

  return (
    <div {...c()}>
      <BContext.Provider value={ctrl}>
        <EditViewport />
        <EditSide />
      </BContext.Provider>
      <JobGrid filter={(job) => job.status !== 'finished'} panel={true} />
    </div>
  );
};
