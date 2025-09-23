import { Css } from '@common/ui';

import { Page, Toolbar, PageBody } from '@common/components';
import { JobsTable } from '../components/JobsTable';
import { SearchField } from '../components/SearchField';

const c = Css('Jobs', {});

export const JobsPage = () => {
  return (
    <Page class={c('Page')}>
      <Toolbar title="Les jobs">
        <SearchField />
      </Toolbar>
      <PageBody>
        <JobsTable />
      </PageBody>
    </Page>
  );
};
