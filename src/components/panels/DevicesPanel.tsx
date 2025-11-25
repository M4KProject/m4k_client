import { Css, humanize } from 'fluxio';
import { toDate, toError, toTime } from 'fluxio';
import { RefreshCw, Trash2, Settings, Plus, Power, MonitorIcon } from 'lucide-react';
import { useState } from 'preact/hooks';
import { setDeviceKey, setPage } from '@/router/setters';
import { useIsAdvanced } from '@/router/hooks';
import { useApi, useGroupDevices, useGroupMedias } from '@/hooks/useApi';
import { formatDate, formatDateTime } from 'fluxio';
import { Grid, GridCols } from '@/components/common/Grid';
import { DeviceModel, MediaModel } from '@/api/models';
import { Field } from '@/components/fields/Field';
import { Button } from '@/components/common/Button';
import { useFlux } from '@/hooks/useFlux';
import { Form } from '@/components/common/Form';
import { showDialog } from '@/components/common/Dialog';
import { Api } from '@/api/Api';
import { Panel } from './base/Panel';

const c = Css('DevicesPanel', {
  Buttons: {
    row: ['center', 'around'],
  },
});

const deviceCols: GridCols<
  DeviceModel,
  {
    api: Api;
    medias: MediaModel[];
    onlineMin: number;
    handleRemote: (device: DeviceModel) => void;
    isAdvanced: boolean | undefined;
  }
> = {
  key: [
    'Clé',
    (d, { api }) => (
      <Button tooltip={d.id}>
        <Field value={d.key} onValue={(key) => api.device.update(d.id, { key })} />
      </Button>
    ),
    { if: (_col, ctx) => !!ctx.isAdvanced },
  ],
  type: [
    'Type',
    (d) => (
      <Button tooltip={() => humanize(d.info)}>
        <Field value={`${d.info?.type || ''} ${d.info?.version || ''}`} readonly />
      </Button>
    ),
    { if: (_col, ctx) => !!ctx.isAdvanced },
  ],
  name: [
    'Nom',
    (d, { api }) => <Field value={d.name} onValue={(name) => api.device.update(d.id, { name })} />,
  ],
  resolution: ['Résolution', (d) => `${d.info?.width || 0}x${d.info?.height || 0}`],
  online: [
    'Online',
    (d, ctx) => (
      <Button tooltip={formatDateTime(toDate(d.online))}>
        <Field type="switch" value={d.online && toTime(d.online) > ctx.onlineMin} readonly />
      </Button>
    ),
  ],
  created: ['Création', (d) => formatDate(d.created)],
  media: [
    'Playlist',
    (d, { api, medias }) => (
      <Field
        type="select"
        items={medias
          .filter((media) => media.type === 'playlist')
          .map((media) => [media.id, media.title || media.key || media.id])}
        value={d.media}
        onValue={(media) => api.device.update(d.id, { media })}
      />
    ),
  ],
  actions: [
    'Actions',
    (d, { api, isAdvanced, handleRemote }) => (
      <div style={{ display: 'flex', gap: '0.5em' }}>
        <Button
          icon={RefreshCw}
          color="primary"
          tooltip="Rafraîchir"
          onClick={() => api.device.update(d.id, { action: 'reload' })}
        />
        <Button
          icon={Power}
          color="primary"
          tooltip="Redémarrer"
          onClick={() => api.device.update(d.id, { action: 'reboot' })}
        />
        {isAdvanced && (
          <Button icon={Settings} tooltip="Mode remote" onClick={() => handleRemote(d)} />
        )}
        {isAdvanced && (
          <Button
            icon={Trash2}
            color="error"
            tooltip="Supprimer"
            onClick={() => api.device.delete(d.id)}
          />
        )}
      </div>
    ),
  ],
};

export const PairingForm = ({ onClose }: { onClose: () => void }) => {
  const api = useApi();
  const [key, setKey] = useState('');
  const group = useFlux(api.groupId$);

  const handlePairing = async () => {
    if (!key) return;

    const cleanKey = key.toLowerCase().replace(/ /g, '');

    try {
      console.log('Tentative de pairage avec le code:', cleanKey);
      await api.pb.req('GET', `pair/${cleanKey}/${group}`);
      onClose();
    } catch (e) {
      const error = toError(e);
      console.error('Erreur lors du pairage:', error);
      alert('Erreur lors du pairage. Vérifiez le code et réessayez.');
      onClose();
    }
  };

  return (
    <Form>
      <Field label="Code de pairage" value={key} onValue={setKey} />
      <div {...c('Buttons')}>
        <Button title="Pairer l'écran" color="primary" onClick={handlePairing} />
      </div>
    </Form>
  );
};

export const DevicesPanel = () => {
  const api = useApi();
  const isAdvanced = useIsAdvanced();
  const medias = useGroupMedias();
  const devices = useGroupDevices();

  // search ? devices.filter((d) => isSearched(d.name, search)) : devices;

  const onlineMin = api.pb.getTime() - 10 * 1000;

  const handleAdd = async () => {
    showDialog('Pairer un nouvel écran', (open$) => {
      return <PairingForm onClose={() => open$.set(false)} />;
    });
  };

  const handleRemote = (device: DeviceModel) => {
    setDeviceKey(device.key || device.id);
    setPage('devices');
  };

  // const handleAddAsMember = async (device: DeviceModel) => {
  //   if (!device.user || !groupId) return;
  //   await collMembers.create({
  //     device: device.id,
  //     user: device.user,
  //     group: groupId,
  //     role: Role.viewer,
  //   });
  // };

  return (
    <Panel icon={<MonitorIcon />} title="Les Appareils" {...c('')}>
      {/* <Toolbar title="Les écrans">
        <SearchField />
      </Toolbar> */}
        <Button icon={Plus} color="primary" onClick={handleAdd}>
          Ajouter
        </Button>
        <Grid
            cols={deviceCols}
            ctx={{ api, medias, onlineMin, handleRemote, isAdvanced }}
            items={devices}
        />
    </Panel>
  );
};
