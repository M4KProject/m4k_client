import { useCss } from '@common/hooks';
import { Css, flexColumn, flexRow } from '@common/helpers';
import { Div, AuthForm, Button } from '@common/components';
import logoUrl from '../assets/logo.svg';
import loginUrl from '../assets/login.svg';

const css: Css = {
  '&': {
    ...flexRow({ align: 'stretch' }),
    position: 'fixed',
    overflow: 'auto',
    background: '#eaf3fa',
    inset: 0,
  },
  '&Content': {
    ...flexColumn({ align: 'center', justify: 'around' }),
    flex: 1,
    textAlign: 'center',
  },
  '&Logo': {
    bgUrl: logoUrl,
    bgMode: 'contain',
    w: 20,
    h: 5,
  },
  '&Title': {
    m: 0,
    p: 0,
    fontSize: 1,
    fontWeight: 500,
    color: '#24a6d8',
  },
  '&Illu': {
    bgUrl: loginUrl,
    bgMode: 'contain',
    height: '15em',
    width: '30em',
  },
  '& &DeviceButton': {
    position: 'fixed',
    bottom: 1,
    left: 1,
    opacity: 0.7,
  },
};

export const AuthPage = () => {
  const c = useCss('AuthPage', css);

  const handleDeviceMode = () => {
    localStorage.setItem('isDevice', 'true');
    window.location.href = '/device/';
  };

  return (
    <Div cls={`${c}`}>
      <Div cls={`${c}Content`}>
        <Div cls={`${c}Logo`} />
        <Div cls={`${c}Title`}>
          PLV DIGITALE - BORNES ET ECRANS INTERACTIFS - CONTENUS NUMERIQUES
        </Div>
        <Div cls={`${c}Illu`} />
      </Div>
      <AuthForm />
      <Button
        cls={`${c}DeviceButton`}
        color="secondary"
        onClick={handleDeviceMode}
        title="Passer en mode device"
      />
    </Div>
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
//             <Div cls={`${c}Links`}>
//                 <Button onClick={() => setPage('forgot-password')}>
//                     Forgot your password?
//                 </Button>
//                 <Button onClick={() => setPage('sign-up')}>
//                     Don't have an account? Sign up
//                 </Button>
//             </Div>
//         </>
//     ) :
//     page === 'sign-up' ? (
//         <>
//             <Field type="email" value={email} onValue={setEmail} label="Your email address" />
//             <Field type="password" value={password} onValue={setPassword} label="Create a Password" />
//             <Button color="primary" onClick={() => signUp(email, password)}>
//                 Sign up
//             </Button>
//             <Div cls={`${c}Links`}>
//                 <Button onClick={() => setPage('sign-in')}>
//                     Already have an account? Sign in
//                 </Button>
//             </Div>
//         </>
//     ) :
//     page === 'forgot-password' ? (
//         <>
//             <Field type="email" value={email} onValue={setEmail} label="Your email address" />
//             <Button color="primary" onClick={() => resetPassword(email)}>
//                 Send reset password instructions
//             </Button>
//             <Div cls={`${c}Links`}>
//                 <Button onClick={() => setPage('code')}>
//                     Utiliser un code
//                 </Button>
//                 <Button onClick={() => setPage('sign-in')}>
//                     Already have an account? Sign in
//                 </Button>
//             </Div>
//         </>
//     ) :
//     page === 'code' ? (
//         <>
//             <Field type="email" value={email} onValue={setEmail} label="Your email address" />
//             <Field type="password" value={password} onValue={setPassword} label="Code" />
//             <Button color="primary" onClick={() => signWithCode(email, password)}>
//                 Connexion avec le CODE
//             </Button>
//             <Div cls={`${c}Links`}>
//                 <Button onClick={() => setPage('sign-in')}>
//                     Already have an account? Sign in
//                 </Button>
//             </Div>
//         </>
//     ) : page
// )} */}
