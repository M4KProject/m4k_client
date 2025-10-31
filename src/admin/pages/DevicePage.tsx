import { Css } from '@common/ui';
import { Page, PageBody, Button, tooltip, Toolbar } from '@common/components';
import { useEffect, useState } from 'preact/hooks';
import { RefreshCw, Power, LogOut } from 'lucide-react';
import { DeviceScreen } from '../components/devices/DeviceScreen';
import { DeviceConsole } from '../components/devices/DeviceConsole';
import { getUrl } from '@/api';
import { glb, jsonStringify } from 'fluxio';
import { deviceSync } from '@/api/sync';
import { useDevice } from '@/api/hooks';

const c = Css('DevicePage', {
  Body: {
    fRow: ['stretch'],
    p: 0.5,
  },
  Screen: {
    fRow: 'stretch',
    flex: 1,
    gap: 2,
  },
});

export const DevicePage = () => {
  const device = useDevice();

  const [consoleOutput, setConsoleOutput] = useState('Console ready...\n');

  useEffect(() => {
    if (device?.result) {
      setConsoleOutput((p) => p + jsonStringify(device.result) + '\n');
    }
  }, [device?.result]);

  const executeAction = async (action: string, input?: any) => {
    if (!device) return;
    try {
      await deviceSync.update(device.id, { action: action as any, input });
      setConsoleOutput((p) => p + `> Action: ${action}\n`);
    } catch (error) {
      setConsoleOutput((p) => p + `> Error: ${error}\n`);
    }
  };

  if (!device) {
    return (
      <Page {...c()}>
        <Toolbar title="Mode Remote"></Toolbar>
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
  const maxWidth = glb.innerWidth * 0.8;
  const maxHeight = glb.innerHeight * 0.6;

  let displayWidth = Math.min(maxWidth, deviceWidth * 0.5);
  let displayHeight = displayWidth / aspectRatio;

  if (displayHeight > maxHeight) {
    displayHeight = maxHeight;
    displayWidth = displayHeight * aspectRatio;
  }

  const captureUrl = device.capture ? getUrl('devices', device.id, device.capture) : '';

  return (
    <Page {...c()}>
      <Toolbar title={device.name || device.key}>
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
      </Toolbar>
      <PageBody {...c('Body')}>
        <div {...c('Screen')}>
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
        </div>
      </PageBody>
    </Page>
  );
};
