import { useState } from 'preact/hooks';
import { Css } from 'fluxio';
import { Button } from '@common/components';
import logoUrl from '@/assets/logo.svg';
import loginUrl from '@/assets/login.svg';
import { Download, Monitor } from 'lucide-react';
import { Apps } from '../components/Apps';
import { isDevice$ } from '@/router';
import { AuthForm } from '@/components/AuthForm';

const c = Css('AuthPage', {
  '': {
    fRow: 'stretch',
    position: 'fixed',
    overflow: 'auto',
    fg: 't2',
    bg: 'b2',
    inset: 0,
  },
  Content: {
    fCol: ['center', 'space-around'],
    flex: 1,
    textAlign: 'center',
  },
  Logo: {
    bgUrl: logoUrl,
    bgMode: 'contain',
    w: 20,
    h: 5,
  },
  Title: {
    m: 0,
    p: 0,
    fontWeight: 500,
    fg: 'p50',
  },
  Illu: {
    bgUrl: loginUrl,
    bgMode: 'contain',
    h: 15,
    w: 30,
  },
  BottomButtons: {
    fRow: 'center',
    position: 'fixed',
    b: 1,
    l: 1,
    opacity: 0.7,
  },
});

export const AuthPage = () => {
  const [showApplications, setShowApplications] = useState(false);

  return (
    <div {...c()}>
      <div {...c('Content')}>
        <div {...c('Logo')} />
        {!showApplications ?
          <>
            <div {...c('Title')}>
              PLV DIGITALE - BORNES ET ECRANS INTERACTIFS - CONTENUS NUMERIQUES
            </div>
            <div {...c('Illu')} />
          </>
        : <>
            <Apps />
            <div />
          </>
        }
      </div>
      <AuthForm />
      <div {...c('BottomButtons')}>
        <Button
          icon={<Download />}
          color="secondary"
          onClick={() => setShowApplications(!showApplications)}
          title="Téléchargement"
        />
        <Button
          icon={<Monitor />}
          color="secondary"
          onClick={() => {
            isDevice$.set(true);
            location.reload();
          }}
          title="Device"
        />
      </div>
    </div>
  );
};
