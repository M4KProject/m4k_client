import { Loading } from '@/components/common/Loading';
import { Css } from 'fluxio';
import { Page } from '../pages/base/Page';

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
