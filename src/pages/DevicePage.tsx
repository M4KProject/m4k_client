import { Css, flexCenter, flexColumn, flexRow } from '@common/helpers';
import { useCss, useMsg } from '@common/hooks';
import { Page, PageHeader, PageBody, Div, Button, Field } from '@common/components';
import { deviceColl } from '@common/api';
import { device$ } from '../controllers/Router';
import { useState } from 'preact/hooks';
import { MdSync } from 'react-icons/md';

const css: Css = {
    '&Body': {
        ...flexColumn({ align: 'stretch' }),
        p: 0.5,
    },
    '&Screen': {
        ...flexRow({ align: 'stretch' }),
        flex: 1,
        gap: 2,
    },
    '&Preview': {
        ...flexCenter(),
        flex: 1,
        rounded: 2,
        bg: '#000',
        m: 0.5,
        position: 'relative',
        bgMode: 'contain',
    },
    '&NoCapture': {
        ...flexCenter(),
        bg: '#FFF',
        fg: '#000',
        p: 1,
    },
    '&WH': {
        position: 'absolute',
        xy: 0,
        fg: '#FFF',
        m: 1,
    },
    '&Console': {
        ...flexColumn({ align: 'stretch' }),
        w: '300px',
        bg: '#1e1e1e',
        border: '1px solid #333',
        borderRadius: '4px',
        overflow: 'hidden',
        m: 0.5,
    },
    '&ConsoleHeader': {
        ...flexCenter(),
        p: 1,
        bg: '#333',
        fg: '#fff',
        fontSize: '14px',
        fontWeight: 'bold',
    },
    '&Logs': {
        flex: 1,
        p: 1,
        bg: '#000',
        fg: '#0f0',
        fontFamily: 'monospace',
        fontSize: '12px',
        overflow: 'auto',
        whiteSpace: 'pre-wrap',
    },
    '&Actions': {
        ...flexRow({ justify: 'center', align: 'center' }),
        gap: 1,
        p: 0.5,
    }
};

export const DevicePage = () => {
    const c = useCss('DevicePage', css);
    const device = useMsg(device$);
    const deviceKey = device?.key;
    const [command, setCommand] = useState('');
    const [consoleOutput, setConsoleOutput] = useState('Console ready...\n');

    const refreshDevice = async () => device$.set(await deviceColl.findKey(deviceKey));

    const executeAction = async (action: string) => {
        if (!device) return;
        try {
            await deviceColl.update(device.id, { action: action as any });
            setConsoleOutput(prev => prev + `> Action: ${action}\n`);
            await refreshDevice();
        } catch (error) {
            setConsoleOutput(prev => prev + `> Error: ${error}\n`);
        }
    };

    const sendCommand = async () => {
        if (!device || !command.trim()) return;
        try {
            await deviceColl.update(device.id, { 
                action: 'sh',
                input: command 
            });
            setConsoleOutput(prev => prev + `> ${command}\n`);
            setCommand('');
            await refreshDevice();
        } catch (error) {
            setConsoleOutput(prev => prev + `> Error: ${error}\n`);
        }
    };

    if (!device) {
        return (
            <Page cls={c}>
                <PageHeader title="Mode Remote">
                </PageHeader>
                <PageBody>
                    <div>Device non trouvé</div>
                </PageBody>
            </Page>
        );
    }

    const deviceWidth = device.width || 1920;
    const deviceHeight = device.height || 1080;
    const aspectRatio = deviceWidth / deviceHeight;
    
    // Calcul de la taille d'affichage (max 80% de la fenêtre)
    const maxWidth = window.innerWidth * 0.8;
    const maxHeight = window.innerHeight * 0.6;
    
    let displayWidth = Math.min(maxWidth, deviceWidth * 0.5);
    let displayHeight = displayWidth / aspectRatio;
    
    if (displayHeight > maxHeight) {
        displayHeight = maxHeight;
        displayWidth = displayHeight * aspectRatio;
    }

    const captureUrl = device.capture ? deviceColl.getUrl(device.id, device.capture) : '';

    return (
        <Page cls={c}>
            <PageHeader title={device.name || device.key}>
                <Button
                    icon={<MdSync />}
                    title="Rafraîchir"
                    onClick={() => executeAction('refresh')}
                />
                <Button
                    icon={<MdSync />}
                    title="Redemarrer"
                    onClick={() => executeAction('reboot')}
                />
                <Button 
                    icon={<MdSync />}
                    title="Fermer le Kiosk"
                    onClick={() => executeAction('exit')}
                />
                <Button 
                    icon={<MdSync />}
                    title="Fermer le Kiosk"
                    onClick={() => executeAction('exit')}
                />
            </PageHeader>
            <PageBody cls={`${c}Body`}>
                <Div cls={`${c}Screen`}>
                    <Div cls={`${c}Preview`} style={{
                        backgroundImage: captureUrl
                    }}>
                        <Div cls={`${c}WH`}>
                            {deviceWidth} × {deviceHeight}
                        </Div>

                        {!captureUrl && (
                            <Div cls={`${c}NoCapture`}>
                                Aucune capture disponible
                            </Div>
                        )}
                    </Div>
                    <Div cls={`${c}Console`}>
                        <Div cls={`${c}Logs`}>
                            {consoleOutput}
                            {device.result && `${device.result}\n`}
                        </Div>
                        <Field
                            type="text"
                            value={command}
                            onValue={setCommand}
                            onKeyDown={(e: KeyboardEvent) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    sendCommand();
                                }
                            }}
                        />
                    </Div>
                </Div>
            </PageBody>
        </Page>
    );
}