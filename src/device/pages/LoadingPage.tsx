import { Css } from '@common/ui';
import { Loading, Page } from '@common/components';

const c = Css('LoadingPage', {
  '': {
    fCenter: [],
  },
});

export const LoadingPage = () => {
  return (
    <Page {...c()}>
      <Loading />
    </Page>
  );
};
