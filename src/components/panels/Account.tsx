import { Css } from 'fluxio';
import { LogOut, KeyRound, UserIcon } from 'lucide-react';
import { useState } from 'preact/hooks';
import { useFlux } from '@/hooks/useFlux';
import { theme$, updateTheme } from '@/utils/theme';
import { Form } from '@/components/common/Form';
import { Field } from '@/components/fields/Field';
import { Panel } from './base/Panel';
import { Button } from '../common/Button';
import { useIsAdvanced, useRouter } from '@/hooks/useRoute';
import { api2 } from '@/api2';

const c = Css('Account', {
  '': {
    wMin: 300,
    flex: 1,
  },
});

export const Account = () => {
  const router = useRouter();
  const theme = useFlux(theme$);
  const auth = useFlux(api2.client.auth$);
  const [passwordError, setPasswordError] = useState('');
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const isAdvanced = useIsAdvanced();

  if (!auth) return null;

  const handleUpdatePassword = async () => {
    try {
      await api2.users.update(auth.userId, { password });
      setPasswordError('');
      setPassword('');
    } catch (_error) {
      setPasswordError('Mot de passe incorrect');
    }
  };

  return (
    <Panel icon={UserIcon} header="Mon Compte" {...c('')}>
      <Form title="Mon compte">
        <Field label="ID de l'utilisateur" name="user_id" value={auth.userId} readonly />
        <Field
          label="Email de l'utilisateur"
          name="username"
          value={auth.email}
          readonly
          stored="email"
          props={{
            autoComplete: 'email',
          }}
        />
        <Field
          type="switch"
          label="Mode avancé"
          name="advanced"
          value={isAdvanced}
          onValue={() => router.isAdvanced$.set(true)}
        />
        <Field
          type="switch"
          label="Mode sombre"
          name="isDark"
          value={theme.isUserDark}
          onValue={(isUserDark) => updateTheme({ isUserDark })}
        />
        <Field
          label="Nouveau mot de passe"
          name="new-password"
          type="password"
          value={password}
          onValue={setPassword}
          props={{
            autoComplete: 'new-password',
          }}
        />
        <Button
          color="primary"
          title="Changer de mot de passe"
          onClick={handleUpdatePassword}
          icon={KeyRound}
        />
        <Button
          color="secondary"
          title="Deconnexion"
          icon={LogOut}
          onClick={() => api2.logout()}
        />
      </Form>
    </Panel>
  );
};
