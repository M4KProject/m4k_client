import { Css } from 'fluxio';
import { Page } from './base/Page';
import { Account } from '../panels/Account';
import { Groups } from '@/components/panels/Groups';

const c = Css('DashboardPage', {
  '': {
    wh: '100%',
    row: ['stretch', 'center'],
    flexWrap: 'wrap',
  },
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
