import { Css } from '@common/ui';
import { Loading } from '@common/components';

const c = Css('LoadingPage', {
  '': {
    fCenter: 1,
  },
});

export const LoadingPage = () => {
  return (
    <div class={c()}>
      <Loading />
    </div>
  );
};
