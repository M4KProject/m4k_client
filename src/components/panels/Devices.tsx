import { Css } from 'fluxio';
import { PlusIcon } from 'lucide-react';
import { useGroupDevices } from '@/hooks/useApi';
import { Button } from '@/components/common/Button';
import { Device } from './Device';
import { DevicePairing } from './DevicePairing';
import { createWindow } from '../common/Window';

const c = Css('Devices', {
  '': {
    flex: 1,
  }
});

export const Devices = () => {
  const devices = useGroupDevices();

  const handleAdd = async () => {
    createWindow({
      title: 'Pairer un nouvel écran',
      content: DevicePairing,
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
