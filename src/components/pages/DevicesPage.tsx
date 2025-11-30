import { Css } from 'fluxio';
import { Page } from './base/Page';
import { DevicesPanel } from '../panels/DevicesPanel';

const c = Css('DevicesPage', {
  '': {},
});

export const DevicesPage = () => {
  return (
    <Page {...c('')}>
      <DevicesPanel />
    </Page>
  );
};
