import { Css } from 'fluxio';
import { Loading } from '@common/components';

const c = Css('LoadingPage', {
  '': {
    fCenter: 1,
  },
});

export const LoadingPage = () => {
  return (
    <div {...c()}>
      <Loading />
    </div>
  );
};
