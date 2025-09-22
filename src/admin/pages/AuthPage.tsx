import { Css, flexColumn, flexRow } from '@common/ui';
import { AuthForm, Button } from '@common/components';
import logoUrl from '../assets/logo.svg';
import loginUrl from '../assets/login.svg';

const c = Css('AuthPage', {
  '': {
    ...flexRow({ align: 'stretch' }),
    position: 'fixed',
    overflow: 'auto',
    background: '#eaf3fa',
    inset: 0,
  },
  Content: {
    ...flexColumn({ align: 'center', justify: 'around' }),
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
    fontSize: 1,
    fontWeight: 500,
    color: '#24a6d8',
  },
  Illu: {
    bgUrl: loginUrl,
    bgMode: 'contain',
    height: '15em',
    width: '30em',
  },
  ' &DeviceButton': {
    position: 'fixed',
    bottom: 1,
    left: 1,
    opacity: 0.7,
  },
});

export const AuthPage = () => {
  const handleDeviceMode = () => {
    localStorage.setItem('isDevice', 'true');
    window.location.href = '/device/';
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
        class={c('DeviceButton')}
        color="secondary"
        onClick={handleDeviceMode}
        title="Passer en mode device"
      />
    </div>
  );
};

// const rootElement = addEl('div', { id: 'm4kAdmin', parent: 'body' })
// createRoot(rootElement).render(<App />);
// router.add('/auth', () => import('./routes/auth'));

// {/* <Auth
//     supabaseClient={supabase}
//     appearance={{ theme: ThemeSupa }}
//     providers={[]}
// />
// {(
//     page === 'sign-in' ? (
//         <>
//             <Field type="email" value={email} onValue={setEmail} label="Your email address" />
//             <Field type="password" value={password} onValue={setPassword} label="Your password" />
//             <Button color="primary" onClick={() => signIn(email, password)}>
//                 Sign in
//             </Button>
//             <div class={c('Links')}>
//                 <Button onClick={() => setPage('forgot-password')}>
//                     Forgot your password?
//                 </Button>
//                 <Button onClick={() => setPage('sign-up')}>
//                     Don't have an account? Sign up
//                 </Button>
//             </div>
//         </>
//     ) :
//     page === 'sign-up' ? (
//         <>
//             <Field type="email" value={email} onValue={setEmail} label="Your email address" />
//             <Field type="password" value={password} onValue={setPassword} label="Create a Password" />
//             <Button color="primary" onClick={() => signUp(email, password)}>
//                 Sign up
//             </Button>
//             <div class={c('Links')}>
//                 <Button onClick={() => setPage('sign-in')}>
//                     Already have an account? Sign in
//                 </Button>
//             </div>
//         </>
//     ) :
//     page === 'forgot-password' ? (
//         <>
//             <Field type="email" value={email} onValue={setEmail} label="Your email address" />
//             <Button color="primary" onClick={() => resetPassword(email)}>
//                 Send reset password instructions
//             </Button>
//             <div class={c('Links')}>
//                 <Button onClick={() => setPage('code')}>
//                     Utiliser un code
//                 </Button>
//                 <Button onClick={() => setPage('sign-in')}>
//                     Already have an account? Sign in
//                 </Button>
//             </div>
//         </>
//     ) :
//     page === 'code' ? (
//         <>
//             <Field type="email" value={email} onValue={setEmail} label="Your email address" />
//             <Field type="password" value={password} onValue={setPassword} label="Code" />
//             <Button color="primary" onClick={() => signWithCode(email, password)}>
//                 Connexion avec le CODE
//             </Button>
//             <div class={c('Links')}>
//                 <Button onClick={() => setPage('sign-in')}>
//                     Already have an account? Sign in
//                 </Button>
//             </div>
//         </>
//     ) : page
// )} */}
