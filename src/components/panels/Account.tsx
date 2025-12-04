import { Css } from 'fluxio';
import { LogOut, KeyRound, UserIcon } from 'lucide-react';
import { useState } from 'preact/hooks';
import { useIsAdvanced } from '@/router/hooks';
import { setIsAdvanced } from '@/router/setters';
import { useFlux } from '@/hooks/useFlux';
import { theme$, updateTheme } from '@/utils/theme';
import { Form } from '@/components/common/Form';
import { Field } from '@/components/fields/Field';
import { useApi } from '@/hooks/useApi';
import { Panel } from './base/Panel';
import { Button } from '../common/Button';

const c = Css('Account', {
  '': {
    wMin: 350,
    flex: 1,
  },
});

export const Account = () => {
  const api = useApi();
  const theme = useFlux(theme$);
  const auth = useFlux(api.pb.auth$);
  const [passwordError, setPasswordError] = useState('');
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const isAdvanced = useIsAdvanced();

  if (!auth) return null;

  const handleUpdatePassword = async () => {
    try {
      await api.userColl.update(auth.id, { oldPassword, password, passwordConfirm: password });
      setPasswordError('');
      setPassword('');
    } catch (_error) {
      setPasswordError('Mot de passe incorrect');
    }
  };

  return (
    <Panel icon={UserIcon} header="Mon Compte" {...c('')}>
      <Form title="Mon compte">
        <Field label="ID de l'utilisateur" name="user_id" value={auth.id} readonly />
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
          onValue={setIsAdvanced}
        />
        <Field
          type="switch"
          label="Mode sombre"
          name="isDark"
          value={theme.isUserDark}
          onValue={(isUserDark) => updateTheme({ isUserDark })}
        />
        <Field
          label="Ancien mot de passe"
          name="current-password"
          type="password"
          value={oldPassword}
          onValue={setOldPassword}
          error={passwordError}
          props={{
            autoComplete: 'current-password',
          }}
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
          onClick={() => api.pb.logout()}
        />
      </Form>
    </Panel>
  );
};
