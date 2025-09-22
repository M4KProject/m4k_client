import { Css } from '@common/ui';
import { Loading, Page } from '@common/components';

const c = Css('LoadingPage', {
  '': {
    fCenter: 1,
  },
});

export const LoadingPage = () => {
  return (
    <Page class={c()}>
      <Loading />
    </Page>
  );
};
