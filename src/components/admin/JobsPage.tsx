import { Css } from 'fluxio';
import { JobGrid } from '@/components/admin/JobGrid';
import { SearchField } from '@/components/admin/SearchField';
import { Page, PageBody } from '@/components/common/Page';
import { Toolbar } from '@/components/common/Toolbar';
import { AdminSideBar } from '@/components/admin/AdminSideBar';

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
