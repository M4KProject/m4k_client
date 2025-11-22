import { Css } from 'fluxio';
import { LogOut, KeyRound } from 'lucide-react';
import { useState } from 'preact/hooks';
import { LoadingPage } from './LoadingPage';
import { useIsAdvanced } from '@/router/hooks';
import { setIsAdvanced } from '@/router/setters';
import { Branding } from '@/components/device/Branding';
import { useFlux } from '@/hooks/useFlux';
import { theme$, updateTheme } from '@/utils/theme';
import { Page, PageBody } from '@/components/Page';
import { Toolbar } from '@/components/Toolbar';
import { Button } from '@/components/Button';
import { Form } from '@/components/Form';
import { Field } from '@/components/Field';
import { useApi } from '@/hooks/apiHooks';
import { AdminSideBar } from '@/components/admin/AdminSideBar';

const c = Css('AccountPage', {});

export const AccountPage = () => {
  const api = useApi();
  const theme = useFlux(theme$);
  const auth = useFlux(api.pb.auth$);
  const [passwordError, setPasswordError] = useState('');
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const isAdvanced = useIsAdvanced();

  if (!auth) return <LoadingPage />;

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
    <Page {...c()} side={AdminSideBar}>
      <Toolbar title="Account">
        <Button color="primary" title="Deconnexion" icon={LogOut} onClick={() => api.pb.logout()} />
        <Button
          color="primary"
          title="Changer de mot de passe"
          onClick={handleUpdatePassword}
          icon={KeyRound}
        />
      </Toolbar>
      <PageBody>
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
          {/* <FieldGroup>
            <Field
              type="color"
              label="Couleur gris"
              name="grey"
              value={theme.grey}
              onValue={(grey) => {
                setTheme({ grey });
                refreshTheme();
              }}
            />
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 'a100', 'a200', 'a400', 'a700'].map(
              (name) => (
                <Color key={name} color={'g' + name} />
              )
            )}
          </FieldGroup> */}
          {/* <FieldGroup>
            <Field
              type="color"
              label="Couleur primaire"
              name="primary"
              value={theme.primary}
              onValue={(primary) => {
                setTheme({ primary });
                refreshTheme();
              }}
            />
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 'a100', 'a200', 'a400', 'a700'].map(
              (name) => (
                <Color key={name} color={'p' + name} />
              )
            )}
          </FieldGroup> */}
          {/* <FieldGroup>
            <Field
              type="color"
              label="Couleur secondaire"
              name="primary"
              value={theme.secondary}
              onValue={(secondary) => {
                setTheme({ secondary });
                refreshTheme();
              }}
            />
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 'a100', 'a200', 'a400', 'a700'].map(
              (name) => (
                <Color key={name} color={'s' + name} />
              )
            )}
          </FieldGroup> */}
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
          <Branding />
        </Form>
      </PageBody>
    </Page>
  );
};
