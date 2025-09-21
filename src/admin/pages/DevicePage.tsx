import { Css, flexRow, flexColumn } from '@common/ui';
import { useCss } from '@common/hooks';
import { Page, PageHeader, PageBody, Div, Button, tooltip } from '@common/components';
import { useEffect, useState } from 'preact/hooks';
import { RefreshCw, Power, LogOut } from 'lucide-react';
import { DeviceScreen } from '../components/DeviceScreen';
import { DeviceConsole } from '../components/DeviceConsole';
import { collSync, getUrl } from '@common/api';
import { stringify } from '@common/utils';
import { useDevice } from '../messages/device$';
import { deviceCtrl } from '../controllers';

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
};

export const DevicePage = () => {
  const c = useCss('DevicePage', css);

  const device = useDevice();

  const [consoleOutput, setConsoleOutput] = useState('Console ready...\n');

  useEffect(() => {
    setConsoleOutput((p) => p + stringify(device.result, null, 2) + '\n');
  }, [device.result]);

  const executeAction = async (action: string, input?: any) => {
    if (!device) return;
    try {
      await deviceCtrl.update(device.id, { action: action as any, input });
      setConsoleOutput((p) => p + `> Action: ${action}\n`);
    } catch (error) {
      setConsoleOutput((p) => p + `> Error: ${error}\n`);
    }
  };

  if (!device) {
    return (
      <Page cls={c}>
        <PageHeader title="Mode Remote"></PageHeader>
        <PageBody>
          <div>Device non trouvé</div>
        </PageBody>
      </Page>
    );
  }

  const deviceWidth = device.info?.width || 1920;
  const deviceHeight = device.info?.height || 1080;
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

  const captureUrl = device.capture ? getUrl('devices', device.id, device.capture) : '';

  return (
    <Page cls={c}>
      <PageHeader title={device.name || device.key}>
        <Button
          icon={<RefreshCw />}
          {...tooltip('Rafraîchir')}
          onClick={() => executeAction('refresh')}
        />
        <Button
          icon={<Power />}
          {...tooltip('Redémarrer')}
          onClick={() => executeAction('reboot')}
        />
        <Button
          icon={<LogOut />}
          {...tooltip('Fermer le Kiosk')}
          onClick={() => executeAction('exit')}
        />
      </PageHeader>
      <PageBody cls={`${c}Body`}>
        <Div cls={`${c}Screen`}>
          <DeviceScreen
            captureUrl={captureUrl}
            deviceWidth={deviceWidth}
            deviceHeight={deviceHeight}
          />
          <DeviceConsole
            device={device}
            consoleOutput={consoleOutput}
            onExecuteAction={executeAction}
          />
        </Div>
      </PageBody>
    </Page>
  );
};
