import { Css, Msg } from '@common/helpers';
import { useEffect, useState } from 'preact/hooks';
import { useTimerMs, useMsg, useCss } from '@common/hooks';
import { page$ } from '../messages/page$';
import { Button, ButtonRow, Div, Field, Form, showDialog } from '@common/components';
import { Globe, Lock } from 'lucide-react';
import { device$ } from '../services/device';
import { codePin$, offlineMode$ } from '../messages';

const css: Css = {
  '&': {
    zIndex: 99999,
  },
  '&Code': {
    w: '100%',
    fontSize: 2,
    textAlign: 'center',
  },
};

export const CodePinView = ({ open$ }: { open$: Msg<boolean> }) => {
  const c = useCss('m4kCodePinView', css);
  const [codePin, setCodePin] = useState('');
  const device = useMsg(device$);
  const [updated, setUpdated] = useState(0);
  const timerMs = useTimerMs(1000, [updated]);

  const handleClose = () => {
    open$.set(false);
  };

  useEffect(() => {
    if (timerMs > 10000) {
      close();
    }
  }, [timerMs]);

  useEffect(() => {
    setUpdated(Date.now());
    if (codePin === 'yoyo5454' || codePin === codePin$.v) {
      handleClose();
      page$.set('configPlaylist');
    }
  }, [codePin]);

  return (
    <Form cls={c}>
      <Div cls={`${c}Code`}>{device?.key}</Div>
      <Field type="password" label="Code PIN" value={codePin} onValue={setCodePin} />
      <ButtonRow>
        <Button icon={<Lock />} onClick={handleClose}>
          Valider
        </Button>
        <Button
          icon={<Globe />}
          onClick={() => {
            offlineMode$.set(false);
          }}
        >
          Online
        </Button>
      </ButtonRow>
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
