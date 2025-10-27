import { useFlux } from '@common/hooks';
import { Css } from '@common/ui';
import { Button, LoadingSpinner } from '@common/components';
import { device$ } from '../services/device';
import { page$ } from '../messages/page$';
import { offlineMode$ } from '../messages';
import { Branding } from '../components/Branding';

const c = Css('PairingPage', {
  '': {
    fCenter: [],
    wh: '100%',
    bg: 'b3',
  },
  Container: {
    bg: 'b0',
    p: 2,
    rounded: 6,
    elevation: 3,
    textAlign: 'center',
    w: 30,
  },
  Title: {
    fg: 't2',
    m: 0.5,
    mb: 0.2,
    bold: 1,
    fontSize: 2,
  },
  Subtitle: {
    color: 't3',
    m: 0.5,
    mt: 0,
  },
  Code: {
    bg: 'b1',
    border: '2px dashed',
    bColor: 'p5',
    rounded: 4,
    p: 1,
    m: 1,
  },
  CodeText: {
    fg: 'p5',
    fontSize: 2,
    letterSpacing: '0.2em',
    bold: 1,
  },
  Buttons: {
    fRow: ['center', 'space-around'],
  },
});

export const PairingPage = () => {
  const device = useFlux(device$);
  const pairingCode = device?.key || device?.id || 'Chargement...';

  return (
    <div class={c()}>
      <div class={c('Container')}>
        <LoadingSpinner />
        <div class={c('Title')}>En attente de pairage</div>
        <div class={c('Subtitle')}>Saisissez cette clé dans l'interface d'administration</div>
        <div class={c('Code')}>
          <div class={c('CodeText')}>{pairingCode.toUpperCase()}</div>
        </div>
        <div class={c('Buttons')}>
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
