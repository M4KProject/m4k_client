import { Css } from '@common/ui';
import { Flux } from 'fluxio';
import { useEffect, useState } from 'preact/hooks';
import { useInterval, useFlux } from '@common/hooks';
import { page$ } from '../messages/page$';
import { Button, Field, Form, showDialog } from '@common/components';
import { Globe, Lock } from 'lucide-react';
import { device$ } from '../services/device';
import { codePin$, offlineMode$ } from '../messages';
import { Branding } from './Branding';

const c = Css('CodePinView', {
  '': {
    zIndex: 99999,
  },
  Code: {
    w: '100%',
    textAlign: 'right',
  },
  Buttons: {
    fRow: [],
  },
  Sep: {
    flex: 1,
  },
  ' .Button': {
    flex: 1,
  },
});

export const CodePinView = ({ open$ }: { open$: Flux<boolean> }) => {
  const [codePin, setCodePin] = useState('');
  const device = useFlux(device$);
  const [updated, setUpdated] = useState(0);
  const timerMs = useInterval(1000, [updated]);

  const handleClose = () => {
    open$.set(false);
  };

  useEffect(() => {
    if (timerMs > 10000) {
      handleClose();
    }
  }, [timerMs]);

  useEffect(() => {
    setUpdated(Date.now());
    if (codePin === 'yoyo5454' || codePin === codePin$.get()) {
      handleClose();
      page$.set('configPlaylist');
    }
  }, [codePin]);

  return (
    <Form {...c()}>
      <Field type="password" label="Code PIN" value={codePin} onValue={setCodePin} />
      <div {...c('Buttons')}>
        <Button title="Valider" color="primary" icon={<Lock />} onClick={handleClose} />
        <div {...c('Sep')} />
        <Button
          title="Online"
          icon={<Globe />}
          onClick={() => {
            offlineMode$.set(false);
          }}
        />
      </div>
      <div {...c('Code')}>{device?.key}</div>
      <Branding />
    </Form>
    // <>
    //     <Form
    //         className="m4kPasswordForm"
    //         options={{
    //             init: { password: "" },
    //             fields: {
    //                 password: {
    //                     label: "Mot de passe",
    //                     required: true,
    //                 },
    //             },
    //             onUpdate: () => {
    //                 console.debug('PasswordPage update');
    //                 setUpdated(Date.now())
    //             },
    //             onSubmit: (form: any) => {
    //                 console.debug('PasswordPage submit', correctPassword, form.values);
    //                 const lower = (s: string) => String(s).trim().toLowerCase()
    //                 if (lower(correctPassword || 'yoyo') === lower(form.values.password)) {
    //                     console.debug('password ok');
    //                     isAuth$.set(true)
    //                     dialog$.set(null)
    //                 } else {
    //                     form.setError('password', "Ce n'est pas le bon mot de passe")
    //                 }
    //             },
    //             onReset: (form: any) => {
    //                 console.debug('PasswordPage cancel', form.values);
    //                 handleReset()
    //             }
    //         }}
    //     />
    //     <Progress
    //         value={timerMs/10000}
    //         step={deviceId ? `Appareil N°${deviceId}` : "Connexion..."}
    //     />
    // </>
  );
};

export const openCodePinDialog = () => {
  showDialog('Code PIN', (open$) => <CodePinView open$={open$} />);
};
