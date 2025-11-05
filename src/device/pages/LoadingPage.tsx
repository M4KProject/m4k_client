import { Css } from 'fluxio';
import { Loading, Page } from '@common/components';

const c = Css('LoadingPage', {
  '': {
    center: 1,
  },
});

export const LoadingPage = () => {
  return (
    <Page {...c()}>
      <Loading />
    </Page>
  );
};
