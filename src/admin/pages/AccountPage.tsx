import { Css } from '@common/ui';
import { useCss } from '@common/hooks';
import { RefreshCw } from 'lucide-react';
import { Page, PageHeader, PageBody, PageActions } from '@common/components';
import { Button } from '@common/components';
import { Form } from '@common/components';
import { Field } from '@common/components';
import { useMsg } from '@common/hooks';
import { LogOut, KeyRound } from 'lucide-react';
import { useState } from 'preact/hooks';
import { LoadingPage } from './LoadingPage';
import { isAdvanced$ } from '../messages';
import { logout, auth$, coll } from '@common/api';

const css: Css = {};

export const AccountPage = () => {
  const c = useCss('AccountPage', css);
  const auth = useMsg(auth$);
  const [passwordError, setPasswordError] = useState('');
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const isAdvanced = useMsg(isAdvanced$);

  if (!auth) return <LoadingPage />;

  const handleUpdatePassword = async () => {
    try {
      await coll('users').update(auth.id, { oldPassword, password, passwordConfirm: password });
      setPasswordError('');
      setPassword('');
    } catch (_error) {
      setPasswordError('Mot de passe incorrect');
    }
  };

  return (
    <Page cls={c}>
      <PageHeader title="Mon compte">
        <Button title="Rafraîchir" icon={<RefreshCw />} color="primary" onClick={() => {}} />
      </PageHeader>
      <PageBody>
        <Form title="Mon compte">
          <Field label="ID de l'utilisateur" name="user_id" value={auth.id} readonly />
          <Field
            label="Email de l'utilisateur"
            name="username"
            value={auth.email}
            readonly
            props={{ autocomplete: 'email' }}
          />
          <Field
            type="switch"
            label="Mode avancé"
            name="advanced"
            msg={isAdvanced$}
            value={isAdvanced}
            onValue={isAdvanced$.setter()}
          />
          <Field
            label="Ancien mot de passe"
            name="current-password"
            type="password"
            value={oldPassword}
            onValue={setOldPassword}
            error={passwordError}
            props={{ autocomplete: 'current-password' }}
          />
          <Field
            label="Nouveau mot de passe"
            name="new-password"
            type="password"
            value={password}
            onValue={setPassword}
            props={{ autocomplete: 'new-password' }}
          />
        </Form>
      </PageBody>
      <PageActions>
        <Button title="Deconnexion" icon={<LogOut />} onClick={logout} />
        <Button
          title="Changer de mot de passe"
          icon={<KeyRound />}
          onClick={handleUpdatePassword}
        />
      </PageActions>
    </Page>
  );
};
