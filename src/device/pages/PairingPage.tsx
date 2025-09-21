import { useMsg } from '@common/hooks';
import { Css, flexColumn } from '@common/ui';
import { Button } from '@common/components';
import { device$ } from '../services/device';
import { page$ } from '../messages/page$';
import { offlineMode$ } from '../messages';
import { FlexRow } from '@common/components/Flex';

const c = Css('PairingPage', {
  '&': {
    ...flexColumn({ align: 'center', justify: 'center' }),
    wh: '100%',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Roboto, sans-serif',
    p: 1.25,
  },
  '&Container': {
    bg: 'white',
    p: 2.5,
    rounded: 6,
    elevation: 4,
    textAlign: 'center',
    wMax: 25,
    w: '100%',
  },
  '&SpinnerContainer': {
    w: 5,
    h: 5,
    bg: '#28A8D9',
    rounded: 50,
    m: '0 auto 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  '&Spinner': {
    w: 2.5,
    h: 2.5,
    border: '3px solid white',
    borderTop: '3px solid transparent',
    rounded: 50,
    anim: {
      name: 'spin',
      duration: '1s',
      timing: 'linear',
      count: 'infinite',
      keyframes: {
        '0%': { transform: { rotate: 0 } },
        '100%': { transform: { rotate: 360 } },
      },
    },
  },
  '&Title': {
    color: '#333',
    mb: 0.625,
    fontSize: 1.5,
    fontWeight: '300',
    m: '0 0 10px 0',
  },
  '&Subtitle': {
    color: '#666',
    mb: 1.875,
    fontSize: 1,
    m: '0 0 30px 0',
  },
  '&CodeContainer': {
    bg: '#f8f9fa',
    border: '2px dashed #28A8D9',
    rounded: 4,
    p: 1.25,
    mb: 1.25,
  },
  '&Code': {
    fontSize: 1.5, // font-size: 24px (réduit pour s'adapter aux clés plus longues)
    fontWeight: 'bold',
    color: '#28A8D9',
    letterSpacing: '2px', // Espacement réduit pour les clés plus longues
    fontFamily: 'monospace',
    wordBreak: 'break-all', // Permet de couper les longues clés si nécessaire
  },
});

export const PairingPage = () => {
  const device = useMsg(device$);
  const pairingCode = device?.key || device?.id || 'Chargement...';

  return (
    <div class={c()}>
      <div class={c('Container')}>
        <div class={c('SpinnerContainer')}>
          <div class={c('Spinner')} />
        </div>

        <h1 class={c('Title')}>En attente de pairage</h1>

        <p class={c('Subtitle')}>Saisissez cette clé dans l'interface d'administration</p>

        <div class={c('CodeContainer')}>
          <div class={c('Code')}>{pairingCode}</div>
        </div>

        <FlexRow>
          <Button
            title="Mode Offline"
            color="secondary"
            onClick={() => {
              offlineMode$.set(true);
              page$.set('kiosk');
            }}
          />
        </FlexRow>
      </div>
    </div>
  );
};
