import { useEffect, useState } from 'preact/hooks';
import { Css, fluxStored, isString } from 'fluxio';
import { Loading } from '@/components/common/Loading';
import { Field } from '@/components/fields/Field';
import { Button } from '@/components/common/Button';
import { Form } from '@/components/common/Form';
import { toError } from 'fluxio';
import { addTr } from '@/hooks/useTr';
import { LogInIcon, UserPlusIcon, MailIcon, KeyIcon, ArrowLeftIcon } from 'lucide-react';
import { api2 } from '@/api2';
import { Tr } from '@/components/common/Tr';
import { useFlux, useFluxState } from '@/hooks/useFlux';

addTr({
  'Failed to authenticate.': 'Échec, vérifier le mot de passe.',
});

const c = Css('AuthForm', {
  '': {
    col: ['stretch', 'center'],
    w: 400,
    bg: 'bg',
    elevation: 2,
  },
  ' .Button': {
    elevation: 0,
  },
  Col: {
    col: 1,
  },
  ' .FieldLabel': {
    my: 4,
  },
});

const email$ = fluxStored('email', '', isString);

export const AuthForm = () => {
  const isAuthLoading = false; // useFlux(isAuthLoading$);
  const [page, setPage] = useState('sign-in');
  const [email, setEmail] = useFluxState(email$);
  // const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const emailField = (
    <Field
      col
      name="username"
      type="email"
      value={email}
      onValue={setEmail}
      label="Votre adresse e-mail"
      stored="email"
      props={{
        autoComplete: 'email',
      }}
    />
  );

  return (
    <div {...c('')}>
      <Form>
        {isAuthLoading ?
          <Loading />
        : page === 'sign-in' ?
          <>
            {emailField}
            <Field
              col
              name="password"
              type="password"
              value={password}
              onValue={setPassword}
              label="Votre mot de passe"
              props={{
                autoComplete: 'current-password',
              }}
              error={passwordError}
            />
            <div {...c('Col')}>
              <Button
                icon={LogInIcon}
                title="Se connecter"
                onClick={async () => {
                  setPage('');
                  try {
                    await api2.authLogin(email, password);
                    setPasswordError('');
                  } catch (error) {
                    setPasswordError(toError(error).message);
                  }
                  setPage('sign-in');
                }}
                color="primary"
              />
              <Button
                title="Mot de passe oublié ?"
                icon={KeyIcon}
                onClick={() => setPage('forgot-password')}
              />
              <Button
                title={(
                  <>
                    <Tr>Vous n'avez pas de compte ?</Tr>
                    <br /><Tr>Inscrivez-vous</Tr>
                  </>
                )}
                icon={UserPlusIcon}
                onClick={() => setPage('sign-up')}
              />
            </div>
          </>
        : page === 'sign-up' ?
          <>
            {emailField}
            <Field
              col
              name="password"
              type="password"
              value={password}
              onValue={setPassword}
              label="Votre mot de passe"
              props={{
                autoComplete: 'new-password',
              }}
            />
            <div {...c('Col')}>
              <Button
                title="S'inscrire"
                onClick={async () => {
                  setPage('');
                  await api2.authRegister(email, password);
                  setPage('sign-in');
                }}
                color="primary"
                icon={UserPlusIcon}
              />
              <Button
                title={(
                  <>
                    <Tr>Vous avez déjà un compte ?</Tr>
                    <br /><Tr>Connectez-vous</Tr>
                  </>
                )}
                icon={LogInIcon}
                onClick={() => setPage('sign-in')}
              />
            </div>
          </>
        : page === 'forgot-password' ?
          <>
            {emailField}
            <div {...c('Col')}>
              <Button
                title="Réinitialiser le mot de passe par email"
                onClick={async () => {
                  setPage('');
                  await api2.passwordReset(email);
                  setPage('sign-in');
                  // setPage('code');
                }}
                color="primary"
                icon={MailIcon}
              />
              <Button
                title={(
                  <>
                    <Tr>Vous avez déjà un compte ?</Tr>
                    <br /><Tr>Connectez-vous</Tr>
                  </>
                )}
                icon={ArrowLeftIcon}
                onClick={() => setPage('sign-in')}
              />
            </div>
          </>
        : page === 'code' ?
          <>
            {emailField}
            <Field col value={password} onValue={setPassword} label="Le CODE reçu par email" />
            <div {...c('Col')}>
              <Button
                title="Connexion avec le CODE"
                onClick={() => {
                  /* signWithCode(email, password) */
                }}
                color="primary"
                icon={KeyIcon}
              />
              <Button
                title={(
                  <>
                    <Tr>Vous avez déjà un compte ?</Tr>
                    <br /><Tr>Connectez-vous</Tr>
                  </>
                )}
                onClick={() => setPage('sign-in')}
                icon={ArrowLeftIcon}
              />
            </div>
          </>
        : <Loading />}
      </Form>
    </div>
  );
};
