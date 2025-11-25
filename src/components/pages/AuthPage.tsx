import { Css } from 'fluxio';
import { Page } from './base/Page';

const c = Css('AuthPage', {
  '': {
  },
});

export const AuthPage = () => {
  return (
    <Page title="" {...c('')}>
    </Page>
  );
};
