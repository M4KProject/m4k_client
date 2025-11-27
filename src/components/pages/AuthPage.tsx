import { useState } from 'preact/hooks';
import { Css } from 'fluxio';
import logoUrl from '@/assets/logo.svg';
import loginUrl from '@/assets/login.svg';
import { Download, Monitor } from 'lucide-react';
import { Apps } from '@/components/admin/Apps';
import { AuthForm } from '@/components/panels/AuthForm';
import { Button } from '@/components/common/Button';
import { useRouter } from '@/hooks/useRoute';

const c = Css('AuthPage', {
  '': {
    row: 'stretch',
    position: 'fixed',
    overflow: 'auto',
    fg: 'txt',
    bg: 'bg0',
    inset: 0,
  },
  Content: {
    col: ['center', 'around'],
    flex: 1,
    textAlign: 'center',
  },
  Logo: {
    bgUrl: logoUrl,
    bgMode: 'contain',
    w: 300,
    h: 100,
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
    h: 200,
    w: 240,
  },
  BottomButtons: {
    row: 'center',
    position: 'fixed',
    b: 8,
    l: 8,
    opacity: 0.7,
  },
});

export const AuthPage = () => {
  const routeController = useRouter();
  const [showApplications, setShowApplications] = useState(false);

  return (
    <div {...c('')}>
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
          icon={Download}
          color="secondary"
          onClick={() => setShowApplications(!showApplications)}
          title="Téléchargement"
        />
        <Button
          icon={Monitor}
          color="secondary"
          onClick={() => {
            routeController.isKiosk$.set(true);
            routeController.go({});
          }}
          title="Kiosk"
        />
      </div>
    </div>
  );
};
