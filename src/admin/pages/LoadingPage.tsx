import { Css } from '@common/ui';
import { Loading } from '@common/components';

const c = Css('LoadingPage', {
  '': {
    fCenter: [],
  },
});

export const LoadingPage = () => {
  return (
    <div {...c()}>
      <Loading />
    </div>
  );
};
