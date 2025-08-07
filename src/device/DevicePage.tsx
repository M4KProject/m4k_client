import { useCss } from '@common/hooks';
import { Css, flexColumn } from '@common/helpers';
import { Div } from '@common/components';

const css: Css = {
  '&': {
    ...flexColumn({ align: 'center', justify: 'center' }),
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Roboto, sans-serif',
    p: 1.25,  // padding: 20px
  },
  '&Container': {
    bg: 'white',
    p: 2.5,  // padding: 40px
    rounded: 6,  // border-radius: 12px
    elevation: 4,  // box-shadow
    textAlign: 'center',
    wMax: 25,  // max-width: 400px
    w: '100%',
  },
  '&SpinnerContainer': {
    w: 5,  // width: 80px
    h: 5,  // height: 80px
    bg: '#28A8D9',
    rounded: 50,  // border-radius: 50% (large value for circle)
    m: '0 auto 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  '&Spinner': {
    w: 2.5,  // width: 40px
    h: 2.5,  // height: 40px
    border: '3px solid white',
    borderTop: '3px solid transparent',
    rounded: 50,  // border-radius: 50%
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
    mb: 0.625,  // margin-bottom: 10px
    fontSize: 1.5,  // font-size: 24px
    fontWeight: '300',
    m: '0 0 10px 0',
  },
  '&Subtitle': {
    color: '#666',
    mb: 1.875,  // margin-bottom: 30px
    fontSize: 1,  // font-size: 16px
    m: '0 0 30px 0',
  },
  '&CodeContainer': {
    bg: '#f8f9fa',
    border: '2px dashed #28A8D9',
    rounded: 4,  // border-radius: 8px
    p: 1.25,  // padding: 20px
    mb: 1.25,  // margin-bottom: 20px
  },
  '&Code': {
    fontSize: 2.25,  // font-size: 36px
    fontWeight: 'bold',
    color: '#28A8D9',
    letterSpacing: '8px',
    fontFamily: 'monospace',
  },
  '&Footer': {
    color: '#999',
    fontSize: 0.875,  // font-size: 14px
    m: '0',
  }
};

// Generate random 5-digit code
const generatePairingCode = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

export const DevicePage = () => {
  const c = useCss('DevicePage', css);
  const pairingCode = generatePairingCode();
  
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
          Saisissez ce code dans l'interface d'administration
        </p>
        
        <Div cls={`${c}CodeContainer`}>
          <Div cls={`${c}Code`}>
            {pairingCode}
          </Div>
        </Div>
        
        <p className={`${c}Footer`}>
          Le code se renouvelle automatiquement toutes les 5 minutes
        </p>
      </Div>
    </Div>
  );
};