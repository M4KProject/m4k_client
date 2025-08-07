import { Css, Msg } from "@common/helpers";
import { useEffect, useState } from "preact/hooks";
import { m4k } from '@common/m4k';
import { useTimerMs, usePromise, useMsg, useCss } from "@common/hooks";
import { setPage } from "../messages/page$";
import { Button, Div, Field, Form, showDialog } from "@common/components";
import { MdLock } from "react-icons/md";
import { device$ } from "../services/device";

const css: Css = {
    '&Code': {
        w: '100%',
        fontSize: 2,
        textAlign: 'center',
    },
};

export const PasswordView = ({ open$ }: { open$: Msg<boolean> }) => {
    const c = useCss('m4kPasswordView', css);
    const [password, setPassword] = useState('');
    const device = useMsg(device$);

    const [correctPassword] = usePromise(() => m4k.get('password'), []);
    const [updated, setUpdated] = useState(0);
    const timerMs = useTimerMs(1000, [updated]);

    const handleClose = () => {
        open$.set(false);
    }

    useEffect(() => {
        setUpdated(Date.now());
    }, [password]);

    useEffect(() => {
        if (timerMs > 10000) {
            close();
        }
    }, [timerMs]);

    useEffect(() => {
        console.debug('PasswordView close', correctPassword, password)
        if ((correctPassword||'yoyo') === password) {
            handleClose();
            setPage('config');
        }
    }, [password]);

    return (
        <Form>
            <Div cls={`${c}Code`}>{device?.key}</Div>
            <Field
                type="password"
                label="Mot de passe"
                value={password}
                onValue={setPassword}
            />
            <Button icon={<MdLock />} onClick={handleClose}>Valider</Button>
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
    )
}

export const openPasswordDialog = () => {
    showDialog("Mot de passe", (open$) => <PasswordView open$={open$} />);
}