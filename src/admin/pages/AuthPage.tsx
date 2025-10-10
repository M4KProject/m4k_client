import { Css } from '@common/ui';
import { AuthForm, Button } from '@common/components';
import logoUrl from '../assets/logo.svg';
import loginUrl from '../assets/login.svg';
import { Settings } from 'lucide-react';

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
  ' &DeviceButton': {
    position: 'fixed',
    b: 1,
    l: 1,
    opacity: 0.7,
  },
});

export const AuthPage = () => {
  const handleDeviceMode = () => {
    window.location.href = '/?device';
  };

  return (
    <div class={c()}>
      <div class={c('Content')}>
        <div class={c('Logo')} />
        <div class={c('Title')}>
          PLV DIGITALE - BORNES ET ECRANS INTERACTIFS - CONTENUS NUMERIQUES
        </div>
        <div class={c('Illu')} />
      </div>
      <AuthForm />
      <Button
        icon={<Settings />}
        class={c('DeviceButton')}
        color="secondary"
        onClick={handleDeviceMode}
        title="Passer en mode device"
      />
    </div>
  );
};
