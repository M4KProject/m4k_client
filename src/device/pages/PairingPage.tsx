import { useCss, useMsg } from '@common/hooks';
import { Css, flexColumn } from '@common/helpers';
import { Button, Div } from '@common/components';
import { device$ } from '../services/device';
import { page$ } from '../messages/page$';

const css: Css = {
  '&': {
    ...flexColumn({ align: 'center', justify: 'center' }),
    hMin: '100vh',
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
        '100%': { transform: { rotate: 360 } }
      }
    }
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
    fontSize: 1.5,  // font-size: 24px (réduit pour s'adapter aux clés plus longues)
    fontWeight: 'bold',
    color: '#28A8D9',
    letterSpacing: '2px', // Espacement réduit pour les clés plus longues
    fontFamily: 'monospace',
    wordBreak: 'break-all', // Permet de couper les longues clés si nécessaire
  },
  '&Footer': {
    color: '#999',
    fontSize: 0.875,
    m: '0',
  }
};

export const PairingPage = () => {
  const c = useCss('PairingPage', css);
  const device = useMsg(device$);
  
  // Utilise la clé du device comme code de pairage
  const pairingCode = device?.key || device?.id || 'Chargement...';
  
  return (
    <Div cls={`${c}`}>
      <Div cls={`${c}Container`}>
        <Div cls={`${c}SpinnerContainer`}>
          <Div cls={`${c}Spinner`} />
        </Div>
        
        <h1 className={`${c}Title`}>
          En attente de pairage
        </h1>
        
        <p className={`${c}Subtitle`}>
          Saisissez cette clé dans l'interface d'administration
        </p>
        
        <Div cls={`${c}CodeContainer`}>
          <Div cls={`${c}Code`}>
            {pairingCode}
          </Div>
        </Div>
        
        <p className={`${c}Footer`}>
          Cette clé est unique à cet appareil
        </p>

        <Button title="Mode Offline" color="primary" onClick={() => {
          page$.set('codePin')
        }}/>
      </Div>
    </Div>
  );
};