import { Css } from '@common/ui';
import { useCss } from '@common/hooks';
import { Page, PageHeader, PageBody } from '@common/components';
import { JobsTable } from '../components/JobsTable';
import { SearchField } from '../components/SearchField';

const css: Css = {
  '&Page': {},
};

export const JobsPage = () => {
  const c = useCss('Jobs', css);

  return (
    <Page cls={`${c}Page`}>
      <PageHeader title="Les jobs">
        <SearchField />
      </PageHeader>
      <PageBody>
        <JobsTable />
      </PageBody>
    </Page>
  );
};
