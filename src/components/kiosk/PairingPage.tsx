import { Css } from 'fluxio';
import { Branding } from '@/components/kiosk/Branding';
import { useFlux } from '@/hooks/useFlux';
import { LoadingSpinner } from '@/components/common/Loading';
import { Button } from '@/components/common/Button';
import { api2 } from '@/api2';
import { kPage$, setKProp, useKDevice } from '@/controllers/Kiosk';
import { bridge } from '@/bridge';

const c = Css('PairingPage', {
  '': {
    center: 1,
    wh: '100%',
    bg: 'bg',
  },
  Container: {
    bg: 'bg',
    p: 8,
    rounded: 8,
    elevation: 3,
    textAlign: 'center',
    w: 340,
  },
  Title: {
    fg: 'fg',
    m: 4,
    mb: 2,
    bold: 1,
    fontSize: 2,
  },
  Subtitle: {
    color: 'fg',
    m: 4,
    mt: 0,
  },
  Code: {
    bg: 'bg',
    border: '2px dashed',
    borderColor: 'primary',
    rounded: 7,
    p: 8,
    m: 8,
  },
  CodeText: {
    fg: 'primary',
    fontSize: 2,
    letterSpacing: '0.2em',
    bold: 1,
  },
  Buttons: {
    row: ['center', 'around'],
  },
});

export const PairingPage = () => {
  const device = useKDevice();
  const pairingCode = device?.key || 'Chargement';

  return (
    <div {...c('')}>
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
              setKProp('offlineMode', true);
              bridge.reload();
            }}
          />
        </div>
      </div>
      <Branding />
    </div>
  );
};
