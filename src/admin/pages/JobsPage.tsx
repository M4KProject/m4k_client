import { Css } from '@common/ui';

import { Page, PageHeader, PageBody } from '@common/components';
import { JobsTable } from '../components/JobsTable';
import { SearchField } from '../components/SearchField';

const c = Css('Jobs', {
  Page: {},
});

export const JobsPage = () => {
  return (
    <Page class={c('Page')}>
      <PageHeader title="Les jobs">
        <SearchField />
      </PageHeader>
      <PageBody>
        <JobsTable />
      </PageBody>
    </Page>
  );
};
