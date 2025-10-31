import { useState } from 'preact/hooks';
import { Css } from '@common/ui/css';
import { Loading } from '@common/components/Loading';
import { Field } from '@common/components/Field';
import { Button } from '@common/components/Button';
import { Form } from '@common/components/Form';
import { toError } from 'fluxio';
import { addTr } from '@common/hooks/useTr';
import { LogIn, UserPlus, Mail, Key, ArrowLeft } from 'lucide-react';
import { userColl } from '@/api';

addTr({
  'Failed to authenticate.': 'Échec, vérifier le mot de passe.',
});

const c = Css('AuthForm', {
  '': {
    fCol: ['stretch', 'center'],
    w: 40,
    bg: 'b0',
  },
  ' .Button': {
    elevation: 0,
  },
  Col: {
    fCol: [],
  },
  ' .FieldLabel': {
    mt: 0.5,
    mb: 0.5,
  },
});

export const AuthForm = () => {
  const isAuthLoading = false; // useFlux(isAuthLoading$);
  const [page, setPage] = useState('sign-in');
  const [email, setEmail] = useState('');
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
      props={{ autoComplete: 'username' }}
    />
  );

  return (
    <div {...c()}>
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
              props={{ autoComplete: 'current-password' }}
              error={passwordError}
            />
            <div {...c('Col')}>
              <Button
                icon={<LogIn />}
                title="Se connecter"
                onClick={async () => {
                  setPage('');
                  try {
                    await userColl.login(email, password);
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
                icon={<Key />}
                onClick={() => setPage('forgot-password')}
              />
              <Button
                title="Vous n'avez pas de compte ? Inscrivez-vous"
                icon={<UserPlus />}
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
              props={{ autoComplete: 'new-password' }}
            />
            <div {...c('Col')}>
              <Button
                title="S'inscrire"
                onClick={async () => {
                  setPage('');
                  await userColl.signUp(email, password);
                  setPage('sign-in');
                }}
                color="primary"
                icon={<UserPlus />}
              />
              <Button
                title="Vous avez déjà un compte ? Connectez-vous"
                icon={<LogIn />}
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
                  await userColl.passwordReset(email);
                  setPage('sign-in');
                  // setPage('code');
                }}
                color="primary"
                icon={<Mail />}
              />
              <Button
                title="Vous avez déjà un compte ? Connectez-vous"
                icon={<ArrowLeft />}
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
                icon={<Key />}
              />
              <Button
                title="Vous avez déjà un compte ? Connectez-vous"
                onClick={() => setPage('sign-in')}
                icon={<ArrowLeft />}
              />
            </div>
          </>
        : <Loading />}
      </Form>
    </div>
  );
};
