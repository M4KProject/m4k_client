import { Css } from 'fluxio';
import { Page } from './base/Page';

const c = Css('MediasPage', {
  '': {
  },
});

export const MediasPage = () => {
  return (
    <Page {...c('')}>
      MediasPage
    </Page>
  );
};
