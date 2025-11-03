import { PageModel } from '@/api';
import { Css } from 'fluxio';
import { JobGrid } from '../jobs/JobGrid';
import { Editor } from '../editor/Editor';

const c = Css('EditPage', {
  '': {
    fCol: 1,
    flex: 1,
  },
});

export const EditPage = ({ page }: { page: PageModel }) => {
  return (
    <div {...c()}>
      <Editor />
      <JobGrid filter={(job) => job.status !== 'finished'} panel={true} />
    </div>
  );
};
