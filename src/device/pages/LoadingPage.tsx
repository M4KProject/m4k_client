import { Css, flexCenter } from '@common/ui';

import { Loading, Page } from '@common/components';

const c = Css('LoadingPage', {
  '': {
    ...flexCenter(),
  },
});

export const LoadingPage = () => {
  return (
    <Page class={c()}>
      <Loading />
    </Page>
  );
};
