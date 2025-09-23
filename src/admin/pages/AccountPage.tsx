import { Css, getColor, refreshTheme, setTheme, theme$ } from '@common/ui';
import { RefreshCw } from 'lucide-react';
import { Page, PageBody, PageActions, Toolbar, FieldGroup } from '@common/components';
import { Button } from '@common/components';
import { Form } from '@common/components';
import { Field } from '@common/components';
import { useMsg } from '@common/hooks';
import { LogOut, KeyRound } from 'lucide-react';
import { useState } from 'preact/hooks';
import { LoadingPage } from './LoadingPage';
import { isAdvanced$ } from '../messages';
import { logout, auth$, coll } from '@common/api';

const c = Css('AccountPage', {
  Color: {
    wh: 2,
    bg: 'red',
  },
});

export const Color = ({ color }: { color: string }) => {
  return <div class={c('Color')} style={{ background: getColor(color) }} />;
};

export const AccountPage = () => {
  const auth = useMsg(auth$);
  const [passwordError, setPasswordError] = useState('');
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const isAdvanced = useMsg(isAdvanced$);
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
        <Button title="Rafraîchir" icon={<RefreshCw />} color="primary" onClick={() => {}} />
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
            msg={isAdvanced$}
            value={isAdvanced}
            onValue={isAdvanced$.setter()}
          />
          <Field
            type="switch"
            label="Dark mode"
            name="isDark"
            value={theme.isDark}
            onValue={(isDark) => {
              setTheme({ isDark });
              refreshTheme();
            }}
          />
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
            <Color color={'#1b1b1b'} />
            <Color color={'#3b3b3b'} />
            <Color color={'#5a5a5a'} />
            <Color color={'#6d6d6d'} />
            <Color color={'#969696'} />
            <Color color={'#b6b6b6'} />
            <Color color={'#d9d9d9'} />
            <Color color={'#e9e9e9'} />
            <Color color={'#f2f2f2'} />
            <Color color={'#f9f9f9'} />
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
            <Color color={'p90'} />
            <Color color={'p80'} />
            <Color color={'p70'} />
            <Color color={'p60'} />
            <Color color={'p50'} />
            <Color color={'p40'} />
            <Color color={'p30'} />
            <Color color={'p20'} />
            <Color color={'p10'} />
            <Color color={'p5'} />
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
            <Color color={'s90'} />
            <Color color={'s80'} />
            <Color color={'s70'} />
            <Color color={'s60'} />
            <Color color={'s50'} />
            <Color color={'s40'} />
            <Color color={'s30'} />
            <Color color={'s20'} />
            <Color color={'s10'} />
            <Color color={'s5'} />
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
