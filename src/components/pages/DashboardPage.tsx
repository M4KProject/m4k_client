import { Css } from 'fluxio';
import { Page } from './base/Page';
import { Account } from '../panels/Account';
import { Groups } from '@/components/panels/Groups';

const c = Css('DashboardPage', {
  '': { alignContent: 'stretch' },
});

export const DashboardPage = () => {
  return (
    <Page {...c('')}>
      <Account />
      <Groups />
      {/* <JobGrid filter={(job) => job.status !== 'finished'} panel={true} /> */}
    </Page>
  );
};
