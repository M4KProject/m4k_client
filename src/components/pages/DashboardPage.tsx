import { Css } from 'fluxio';
import { Page } from './base/Page';
import { AccountPanel } from '../panels/AccountPanel';
import { GroupPanel } from '@/components/panels/GroupPanel';

const c = Css('DashboardPage', {
  '': {
    wh: '100%',
    row: ['stretch', 'center'],
    flexWrap: 'wrap',
  },
});

export const DashboardPage = () => {
  return (
    <Page title="Tableau de bord" {...c('')}>
      <AccountPanel />
      <GroupPanel />
      {/* <JobGrid filter={(job) => job.status !== 'finished'} panel={true} /> */}
    </Page>
  );
};
