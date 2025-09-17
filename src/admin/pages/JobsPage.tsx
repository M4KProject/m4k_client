import { Css } from '@common/ui';
import { useCss, useMsg } from '@common/hooks';
import { isAdvanced$, search$ } from '../messages';
import { Page, PageHeader, PageBody } from '@common/components';
import { JobsTable } from '../components/JobsTable';
import { groupId$ } from '@common/api/messages';
import { syncJobs } from '@common/api/syncJobs';
import { useEffect } from 'preact/hooks';

const css: Css = {
  '&Page': {},
};

export const JobsPage = () => {
  const c = useCss('Jobs', css);

  return (
    <Page cls={`${c}Page`}>
      <PageHeader title="Les jobs">
        {/* <Button
          title="Rafraîchir"
          {...tooltip('Rafraîchir')}
          icon={<RefreshCw />}
          color="primary"
          onClick={handleRefresh}
        /> */}
        {/* <SearchField /> */}
      </PageHeader>
      <PageBody>
        <JobsTable />
      </PageBody>
    </Page>
  );
};
