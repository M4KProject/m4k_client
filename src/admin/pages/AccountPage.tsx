import { Css, getColor, refreshTheme, setTheme, theme$ } from '@common/ui';
import { Page, PageBody, Toolbar, FieldGroup, tooltip } from '@common/components';
import { Button } from '@common/components';
import { Form } from '@common/components';
import { Field } from '@common/components';
import { useMsg } from '@common/hooks';
import { LogOut, KeyRound } from 'lucide-react';
import { useState } from 'preact/hooks';
import { LoadingPage } from './LoadingPage';
import { logout, auth$, coll } from '@common/api';
import { repeat } from '@common/utils';
import { setIsAdvanced, useIsAdvanced } from '../controllers/router';

const c = Css('AccountPage', {
  Color: {
    h: 1,
    w: 1,
    bg: 'red',
  },
});

export const Color = ({ color }: { color: string }) => (
  <div {...tooltip(color)} class={c('Color')} style={{ background: getColor(color) }} />
);

export const AccountPage = () => {
  const auth = useMsg(auth$);
  const [passwordError, setPasswordError] = useState('');
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const isAdvanced = useIsAdvanced();
  const theme = useMsg(theme$);

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
    <Page class={c()}>
      <Toolbar title="Account">
        <Button color="primary" title="Deconnexion" icon={<LogOut />} onClick={logout} />
        <Button
          color="primary"
          title="Changer de mot de passe"
          onClick={handleUpdatePassword}
          icon={<KeyRound />}
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
            props={{ autocomplete: 'email' }}
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
            value={theme.mode === 'dark'}
            onValue={(isDark) => {
              setTheme({ mode: isDark ? 'dark' : 'light' });
              refreshTheme();
            }}
          />
          <FieldGroup>
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
          </FieldGroup>
          <FieldGroup>
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
          </FieldGroup>
          <FieldGroup>
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
          </FieldGroup>
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
    </Page>
  );
};
