import { Css } from '@common/ui';
import { isSearched, sort } from '@common/utils';
import { useAsync, useCss, useMsg } from '@common/hooks';
import { isAdvanced$, search$ } from '../messages';
import { RefreshCw } from 'lucide-react';
import { JobModel, ModelUpdate } from '@common/api/models';
import { tooltip, Page, PageHeader, PageBody, Button } from '@common/components';
import { SearchField } from '../components/SearchField';
import { JobsTable } from '../components/JobsTable';
import { groupId$ } from '@common/api/messages';
import { collGroups } from '@common/api/collGroups';
import { collJobs } from '@common/api/collJobs';
import { syncJobs } from '@common/api/syncJobs';
import { useEffect } from 'preact/hooks';

const css: Css = {
  '&Page': {},
};

export const JobsPage = () => {
  const c = useCss('Jobs', css);
  const search = useMsg(search$);
  const groupId = useMsg(groupId$);
  const isAdvanced = useMsg(isAdvanced$);

  useEffect(() => {
    syncJobs.init();
  }, []);

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
