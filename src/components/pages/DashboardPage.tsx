import { Css } from 'fluxio';
import { Page } from './base/Page';

const c = Css('DashboardPage', {
  '': {
    row: 'stretch',
    flex: 1,
    bg: '#FF0000',
  },
});

export const DashboardPage = () => {
  return (
    <Page title="Tableau de bord" {...c()}>
      Dashboard
      {/* <JobGrid filter={(job) => job.status !== 'finished'} panel={true} /> */}
    </Page>
  );
};
