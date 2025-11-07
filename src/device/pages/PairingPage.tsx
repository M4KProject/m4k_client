import { Css } from 'fluxio';
import { device$ } from '../services/device';
import { page$ } from '../messages/page$';
import { offlineMode$ } from '../messages';
import { Branding } from '../components/Branding';
import { useFlux } from '@/hooks/useFlux';
import { LoadingSpinner } from '@/components/Loading';
import { Button } from '@/components/Button';

const c = Css('PairingPage', {
  '': {
    center: 1,
    wh: '100%',
    bg: 'b3',
  },
  Container: {
    bg: 'b0',
    p: 2,
    rounded: 6,
    elevation: 3,
    textAlign: 'center',
    w: 240,
  },
  Title: {
    fg: 't2',
    m: 4,
    mb: 2,
    bold: 1,
    fontSize: 2,
  },
  Subtitle: {
    color: 't3',
    m: 4,
    mt: 0,
  },
  Code: {
    bg: 'b1',
    border: '2px dashed',
    borderColor: 'p5',
    rounded: 7,
    p: 8,
    m: 8,
  },
  CodeText: {
    fg: 'p5',
    fontSize: 2,
    letterSpacing: '0.2em',
    bold: 1,
  },
  Buttons: {
    row: ['center', 'around'],
  },
});

export const PairingPage = () => {
  const device = useFlux(device$);
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
