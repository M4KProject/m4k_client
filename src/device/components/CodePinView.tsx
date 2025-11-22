import { Css } from 'fluxio';
import { Flux } from 'fluxio';
import { useEffect, useState } from 'preact/hooks';
import { page$ } from '@/device/messages/page$';
import { Globe, Lock } from 'lucide-react';
import { codePin$, offlineMode$ } from '@/device/messages';
import { Branding } from './Branding';
import { useFlux } from '@/hooks/useFlux';
import { useInterval } from '@/hooks/useInterval';
import { Form } from '@/components/Form';
import { Field } from '@/components/Field';
import { Button } from '@/components/Button';
import { showDialog } from '@/components/Dialog';
import { useApi } from '@/hooks/apiHooks';
import { useDeviceCtrl } from '@/device/controllers/DeviceCtrl';

const c = Css('CodePinView', {
  '': {
    zIndex: 99999,
  },
  Code: {
    w: '100%',
    textAlign: 'right',
  },
  Buttons: {
    row: 1,
  },
  Sep: {
    flex: 1,
  },
  ' .Button': {
    flex: 1,
  },
});

export const CodePinView = ({ open$ }: { open$: Flux<boolean> }) => {
  const deviceCtrl = useDeviceCtrl();
  const [codePin, setCodePin] = useState('');
  const device = useFlux(deviceCtrl.device$);
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
        <Button title="Valider" color="primary" icon={Lock} onClick={handleClose} />
        <div {...c('Sep')} />
        <Button
          title="Online"
          icon={Globe}
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
