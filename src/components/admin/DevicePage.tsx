import { Css, toString } from 'fluxio';
import { useEffect, useState } from 'preact/hooks';
import { RefreshCw, Power, LogOut } from 'lucide-react';
import { DeviceScreen } from '@/components/admin/DeviceScreen';
import { DeviceConsole } from '@/components/admin/DeviceConsole';
import { glb, jsonStringify } from 'fluxio';
import { useApi, useDevice } from '@/hooks/useApi';
import { Page, PageBody } from '@/components/common/Page';
import { Toolbar } from '@/components/common/Toolbar';
import { Button } from '@/components/common/Button';
import { AdminSideBar } from '@/components/admin/AdminSideBar';

const c = Css('DevicePage', {
  Body: {
    row: 'stretch',
    p: 4,
  },
  Screen: {
    row: 'stretch',
    flex: 1,
    gap: 2,
  },
});

export const DevicePage = () => {
  const api = useApi();
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
      await api.device.update(device.id, { action: action as any, input });
      setConsoleOutput((p) => p + `> Action: ${action}\n`);
    } catch (error) {
      setConsoleOutput((p) => p + `> Error: ${error}\n`);
    }
  };

  if (!device) {
    return (
      <Page {...c('')} side={AdminSideBar}>
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

  const captureUrl =
    device.capture ? api.device.coll.getFileUrl(device.id, toString(device.capture)) : '';

  return (
    <Page {...c('')} side={AdminSideBar}>
      <Toolbar title={device.name || device.key}>
        <Button icon={RefreshCw} tooltip="Rafraîchir" onClick={() => executeAction('refresh')} />
        <Button icon={Power} tooltip="Redémarrer" onClick={() => executeAction('reboot')} />
        <Button icon={LogOut} tooltip="Fermer le Kiosk" onClick={() => executeAction('exit')} />
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
