import { Css } from 'fluxio';
import { KioskApp } from '../kiosk/KioskApp';

const c = Css('KioskPage', {
  '': { 
    wh: '100%'
  }
});

export const KioskPage = () => {
  return (
    <div {...c('')}>
      <KioskApp />
    </div>
  );
};
