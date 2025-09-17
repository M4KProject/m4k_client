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

const css: Css = {
  '&Page': {},
};

export const JobsPage = () => {
  const c = useCss('Jobs', css);
  const search = useMsg(search$);
  const groupId = useMsg(groupId$);
  const isAdvanced = useMsg(isAdvanced$);

  const [groups, groupsRefresh] = useAsync([], () => collGroups.find({}));

  const [jobs, jobsRefresh] = useAsync(
    [],
    () => collJobs.find(groupId ? { group: groupId } : {}),
    'jobs',
    [groupId]
  );

  const sortedJobs = sort(jobs, (j) => -new Date(j.updated).getTime());

  const filteredJobs = search
    ? sortedJobs.filter((j) =>
        isSearched(
          (j.action || '') + (j.status || '') + (j.error || '') + JSON.stringify(j.input || {}),
          search
        )
      )
    : sortedJobs;

  const handleRefresh = () => {
    jobsRefresh();
    groupsRefresh();
  };

  const handleUpdate = async (job: JobModel, changes: ModelUpdate<JobModel>) => {
    await collJobs.update(job.id, changes);
    jobsRefresh();
  };

  const handleDelete = async (job: JobModel) => {
    await collJobs.delete(job.id);
    await jobsRefresh();
  };

  return (
    <Page cls={`${c}Page`}>
      <PageHeader title="Les jobs">
        <Button
          title="Rafraîchir"
          {...tooltip('Rafraîchir')}
          icon={<RefreshCw />}
          color="primary"
          onClick={handleRefresh}
        />
        <SearchField />
      </PageHeader>
      <PageBody>
        <JobsTable
          jobs={filteredJobs}
          groups={groups}
          isAdvanced={isAdvanced}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </PageBody>
    </Page>
  );
};
