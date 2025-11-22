import { Loading } from '@/components/Loading';
import { Page } from '@/components/Page';
import { Css } from 'fluxio';

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
