import { Css, flexCenter } from '@common/ui';

import { Div, Loading } from '@common/components';

const css = Css('LoadingPage', {
  '&': {
    ...flexCenter(),
  },
});

export const LoadingPage = () => {
  return (
    <Div  cls={css()}>
      <Loading />
    </Div>
  );
};
