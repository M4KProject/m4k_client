import { Css } from 'fluxio';
import { useBEditController } from '../useBEditController';

const c = Css('BSideWeb', {});

export const BSideWeb = () => {
  const controller = useBEditController();
  return <div {...c('')}>BSideWeb</div>;
};
