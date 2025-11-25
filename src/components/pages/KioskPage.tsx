import { Css } from 'fluxio';
import { Page } from './base/Page';

const c = Css('KioskPage', {
  '': {
  },
});

export const KioskPage = () => {
  return (
    <Page title="" {...c('')}>
    </Page>
  );
};
