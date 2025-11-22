import { Css } from 'fluxio';
import { JobGrid } from '../components/jobs/JobGrid';
import { SearchField } from '../components/SearchField';
import { Page, PageBody } from '@/components/Page';
import { Toolbar } from '@/components/Toolbar';
import { AdminSideBar } from '../components/AdminSideBar';

const c = Css('Jobs', {});

export const JobsPage = () => {
  return (
    <Page {...c('Page')} side={AdminSideBar}>
      <Toolbar title="Les jobs">
        <SearchField />
      </Toolbar>
      <PageBody>
        <JobGrid />
      </PageBody>
    </Page>
  );
};
