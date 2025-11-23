import { Css } from 'fluxio';
import { page$ } from '@/controllers/page$';
import { offlineMode$ } from '@/controllers/deviceMessages';
import { Branding } from '@/components/device/Branding';
import { useFlux } from '@/hooks/useFlux';
import { LoadingSpinner } from '@/components/common/Loading';
import { Button } from '@/components/common/Button';
import { useDeviceController } from '@/hooks/useDeviceController';

const c = Css('PairingPage', {
  '': {
    center: 1,
    wh: '100%',
    bg: 'bg',
  },
  Container: {
    bg: 'bg',
    p: 2,
    rounded: 6,
    elevation: 3,
    textAlign: 'center',
    w: 240,
  },
  Title: {
    fg: 't',
    m: 4,
    mb: 2,
    bold: 1,
    fontSize: 2,
  },
  Subtitle: {
    color: 't',
    m: 4,
    mt: 0,
  },
  Code: {
    bg: 'bg',
    border: '2px dashed',
    borderColor: 'p',
    rounded: 7,
    p: 8,
    m: 8,
  },
  CodeText: {
    fg: 'p',
    fontSize: 2,
    letterSpacing: '0.2em',
    bold: 1,
  },
  Buttons: {
    row: ['center', 'around'],
  },
});

export const PairingPage = () => {
  const deviceCtrl = useDeviceController();
  const device = useFlux(deviceCtrl.device$);
  const pairingCode = device?.key || device?.id || 'Chargement...';

  return (
    <div {...c()}>
      <div {...c('Container')}>
        <LoadingSpinner />
        <div {...c('Title')}>En attente de pairage</div>
        <div {...c('Subtitle')}>Saisissez cette clé dans l'interface d'administration</div>
        <div {...c('Code')}>
          <div {...c('CodeText')}>{pairingCode.toUpperCase()}</div>
        </div>
        <div {...c('Buttons')}>
          <Button
            title="Mode Offline"
            color="secondary"
            onClick={() => {
              offlineMode$.set(true);
              page$.set('kiosk');
            }}
          />
        </div>
      </div>
      <Branding />
    </div>
  );
};
