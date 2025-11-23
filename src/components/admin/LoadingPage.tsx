import { Loading } from '@/components/common/Loading';
import { Css } from 'fluxio';

const c = Css('LoadingPage', {
  '': {
    center: 1,
  },
});

export const LoadingPage = () => {
  return (
    <div {...c()}>
      <Loading />
    </div>
  );
};
