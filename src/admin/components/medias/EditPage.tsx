import { PageModel } from '@/api';
import { Css } from 'fluxio';
import { JobGrid } from '../jobs/JobGrid';
import { EditViewport } from './page/EditViewport';
import { EditSide } from './page/EditSide';
import { useEffect } from 'preact/hooks';
import { sideOpen$ } from '@common/components';

const c = Css('EditPage', {
  '': {
    fRow: 'stretch',
    flex: 1,
  },
});

export const EditPage = ({ page }: { page: PageModel }) => {
  useEffect(() => {
    sideOpen$.set(false);
    return () => {
      sideOpen$.set(true);
    };
  }, []);

  return (
    <div {...c()}>
      <EditViewport />
      <EditSide />
      <JobGrid filter={(job) => job.status !== 'finished'} panel={true} />
    </div>
  );
};
