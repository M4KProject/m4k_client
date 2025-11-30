import { Css } from 'fluxio';
import { KioskApp } from '../kiosk/KioskApp';

const c = Css('KioskPage', {
  '': {},
});

export const KioskPage = () => {
  return (
    <div {...c('')}>
      <KioskApp />
    </div>
  );
};
