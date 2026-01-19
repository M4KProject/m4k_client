import { Css, toString } from 'fluxio';
import { useEffect, useState } from 'preact/hooks';
import { glb, jsonStringify } from 'fluxio';
import { useDevice } from '@/hooks/useApi2';
import { api2 } from '@/api2';

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
      await api2.devices.update(device.id, { action: action as any, input });
      setConsoleOutput((p) => p + `> Action: ${action}\n`);
    } catch (error) {
      setConsoleOutput((p) => p + `> Error: ${error}\n`);
    }
  };

  if (!device) {
    return null;
    // return (
    //   <Page {...c('')} side={AdminSideBar}>
    //     <Toolbar title="Mode Remote"></Toolbar>
    //     <PageBody>
    //       <div>Device non trouvé</div>
    //     </PageBody>
    //   </Page>
    // );
  }

  const deviceWidth = device.width || 1920;
  const deviceHeight = device.height || 1080;
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
    device.capture ? api2.devices.getFileUrl(device.id, toString(device.capture)) : '';

  return null;
  // return (0
};
