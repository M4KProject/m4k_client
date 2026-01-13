import { Css } from 'fluxio';
import { Page } from './base/Page';
import { Devices } from '../panels/Devices';

const c = Css('DevicesPage', {
  '': {
    rowWrap: 1,
  },
});

export const DevicesPage = () => {
  return (
    <Page {...c('')}>
      <Devices />
    </Page>
  );
};
