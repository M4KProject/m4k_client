import { Css, flexCenter } from '@common/ui';

import { Loading, Page } from '@common/components';

const css = Css('LoadingPage', {
  '&': {
    ...flexCenter(),
  },
});

export const LoadingPage = () => {
  return (
    <Page cls={css()}>
      <Loading />
    </Page>
  );
};
