import { Css } from 'fluxio';
import { JobGrid } from '../components/jobs/JobGrid';
import { SearchField } from '../components/SearchField';
import { Page, PageBody } from '@/components/Page';
import { Toolbar } from '@/components/Toolbar';

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
