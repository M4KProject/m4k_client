import { Css, flexCenter } from '@common/ui';

import { Loading } from '@common/components';

const c = Css('LoadingPage', {
  '&': {
    ...flexCenter(),
  },
});

export const LoadingPage = () => {
  return (
    <div  class={c()}>
      <Loading />
    </div>
  );
};
