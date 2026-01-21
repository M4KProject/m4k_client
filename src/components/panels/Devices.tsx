import { Css, toVoid } from 'fluxio';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Device } from './Device';
import { DevicePairing } from './DevicePairing';
import { createWindow } from '../common/Window';
import { useDevices } from '@/hooks/useApi2';

const c = Css('Devices', {
  '': {
    flex: 1,
  },
});

export const Devices = () => {
  const devices = useDevices();

  const handleAdd = () => {
    createWindow({
      modal: true,
      title: 'Pairer un nouvel écran',
      content: DevicePairing,
      cancel: toVoid,
      size: [350, 150],
      min: [200, 200],
    });
  };

  return (
    <>
      {devices.map((device) => (
        <Device key={device.id} device={device} />
      ))}
      <Button big {...c('Add')} icon={PlusIcon} color="primary" onClick={handleAdd}>
        Ajouter un Appareil
      </Button>
    </>
  );
};
