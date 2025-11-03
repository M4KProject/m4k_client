import { Css } from 'fluxio';
import { Loading, Page } from '@common/components';

const c = Css('LoadingPage', {
  '': {
    fCenter: 1,
  },
});

export const LoadingPage = () => {
  return (
    <Page {...c()}>
      <Loading />
    </Page>
  );
};
