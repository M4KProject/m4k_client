import { Loading } from '@/components/common/Loading';
import { Page } from '@/components/common/Page';
import { Css } from 'fluxio';

const c = Css('LoadingPage', {
  '': {
    center: 1,
  },
});

export const LoadingPage = () => {
  return (
    <Page {...c('')}>
      <Loading />
    </Page>
  );
};
