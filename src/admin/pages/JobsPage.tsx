import { Css } from 'fluxio';
import { Page, Toolbar, PageBody } from '@common/components';
import { JobGrid } from '../components/jobs/JobGrid';
import { SearchField } from '../components/SearchField';

const c = Css('Jobs', {});

export const JobsPage = () => {
  return (
    <Page {...c('Page')}>
      <Toolbar title="Les jobs">
        <SearchField />
      </Toolbar>
      <PageBody>
        <JobGrid />
      </PageBody>
    </Page>
  );
};
