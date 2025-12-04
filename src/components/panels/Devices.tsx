import { Css } from 'fluxio';
import { Plus, MonitorIcon } from 'lucide-react';
import { useGroupDevices } from '@/hooks/useApi';
import { Button } from '@/components/common/Button';
import { showDialog } from '@/components/common/Dialog';
import { Panel } from './base/Panel';
import { Device } from './Device';
import { DevicePairing } from './DevicePairing';
import { createWindow } from '../common/Window';

const c = Css('Device', {
  '': {
  },
  Content: {
    rowWrap: 1,
    p: 8,
  },
  AddButton: {
    m: 8,
  },
});

export const Devices = () => {
  const devices = useGroupDevices();
  
  const handleAdd = async () => {
    createWindow({
      title: 'Pairer un nouvel écran',
      content: DevicePairing,
    })
  };

  return (
    <Panel icon={<MonitorIcon />} title="Les Appareils" {...c('Panel')}>
      <div {...c('PanelContent')}>
        {devices.map(device => (
          <Device device={device} />
        ))}
        <Button icon={Plus} color="primary" onClick={handleAdd}>
          Ajouter un Appareil
        </Button>
      </div>
    </Panel>
  );
};
