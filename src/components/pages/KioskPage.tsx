import { Css } from 'fluxio';

const c = Css('KioskPage', {
  '': {
  },
});

export const KioskPage = () => {
  return (
    <div {...c('')}>
      KIOSK
    </div>
  );
};
