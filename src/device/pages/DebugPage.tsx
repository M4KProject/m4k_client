import { m4k } from '@common/m4k';
import { stringify } from "@common/helpers";
import { Button, Field, Form, Page, PageBody, PageHeader } from "@common/components";
import { useState } from 'preact/hooks';

// setCss('m4kDebugPage', {
//     '&': {
//         ...flexColumn(),
//         position: 'absolute',
//         inset: 0,
//         overflowX: 'hidden',
//         overflowY: 'auto',
//     }
// });

// const initValues$ = new Msg(
//     {
//         script: "",
//         type: "js",
//         result: ""
//     },
//     "m4kDebugPage",
//     true
// )

export const DebugPage = () => {
    const [script, setScript] = useState('');
    const [type, setType] = useState('');
    const [result, setResult] = useState<any>(null);

    const handle = async () => {
        console.debug('DebugPage handle');
        const result = await (() => {
            switch (type) {
                case 'su': return m4k.su(script);
                case 'sh': return m4k.sh(script);
                default: return m4k.js(script);
            }
        })();
        setResult(result);
    }

    return (
        <Page>
            <PageHeader title="Debug">
                <Button onClick={handle}>Executer</Button>
            </PageHeader>
            <PageBody>
                <Form>
                    <Field label="Script" required type="multiline" value={script} onValue={setScript} />
                    <Field label="Type" type="select" value={type} onValue={setType} items={[
                        ['js', 'JS'],
                        ['su', 'SU'],
                        ['sh', 'SH'],
                    ]} />
                    <Field label="Résultat" type="multiline" value={stringify(result, null, 2)||String(result)} />
                    <Field label="Valeur" type="multiline" value={stringify(result?.value, null, 2)||String(result?.value)} />
                </Form>
            </PageBody>
        </Page>
    )
}
