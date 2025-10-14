import { Css } from '@common/ui';
import { formatDate, formatDateTime, stringify, toDate, toError, toTime } from '@common/utils';
import { useMsg } from '@common/hooks';
import {
  Button,
  Field,
  Grid,
  Page,
  Toolbar,
  PageBody,
  tooltip,
  showDialog,
  Form,
} from '@common/components';
import { GridCols } from '@common/components/Grid';
import { RefreshCw, Trash2, Settings, Plus, Power } from 'lucide-react';
import { useState } from 'preact/hooks';
import { apiGet, serverTime, DeviceModel, groupId$, MediaModel } from '@common/api';
import { SearchField } from '../components/SearchField';
import { deviceSync } from '@/api/sync';
import { setDeviceKey, setPage } from '../../router/setters';
import { useIsAdvanced } from '@/router/hooks';
import { useGroupDevices, useGroupMedias } from '@/api/hooks';

const c = Css('DevicesPage', {
  Buttons: {
    fRow: ['center', 'space-around'],
  },
});

const deviceCols: GridCols<
  DeviceModel,
  {
    deviceSync: typeof deviceSync;
    medias: MediaModel[];
    onlineMin: number;
    handleRemote: (device: DeviceModel) => void;
    isAdvanced: boolean | undefined;
  }
> = {
  key: [
    'Clé',
    (d, ctx) => (
      <Field
        {...tooltip(d.id)}
        value={d.key}
        onValue={(key) => ctx.deviceSync.update(d.id, { key })}
      />
    ),
    { if: (_col, ctx) => !!ctx.isAdvanced },
  ],
  type: [
    'Type',
    (d) => (
      <Field
        {...tooltip(() => stringify(d.info))}
        value={`${d.info?.type || ''} ${d.info?.version || ''}`}
        readonly
      />
    ),
    { if: (_col, ctx) => !!ctx.isAdvanced },
  ],
  name: [
    'Nom',
    (d, ctx) => <Field value={d.name} onValue={(name) => ctx.deviceSync.update(d.id, { name })} />,
  ],
  resolution: ['Résolution', (d) => `${d.info?.width || 0}x${d.info?.height || 0}`],
  online: [
    'Online',
    (d, ctx) => (
      <Field
        {...tooltip(formatDateTime(toDate(d.online)))}
        type="switch"
        value={d.online && toTime(d.online) > ctx.onlineMin}
        readonly
      />
    ),
  ],
  created: ['Création', (d) => formatDate(d.created)],
  media: [
    'Playlist',
    (d, ctx) => (
      <Field
        type="select"
        items={ctx.medias
          .filter((media) => media.type === 'playlist')
          .map((media) => [media.id, media.title || media.key || media.id])}
        value={d.media}
        onValue={(media) => ctx.deviceSync.update(d.id, { media })}
      />
    ),
  ],
  actions: [
    'Actions',
    (d, ctx) => (
      <div style={{ display: 'flex', gap: '0.5em' }}>
        <Button
          icon={<RefreshCw />}
          color="primary"
          {...tooltip('Rafraîchir')}
          onClick={() => ctx.deviceSync.update(d.id, { action: 'reload' })}
        />
        <Button
          icon={<Power />}
          color="primary"
          {...tooltip('Redémarrer')}
          onClick={() => ctx.deviceSync.update(d.id, { action: 'reboot' })}
        />
        {ctx.isAdvanced && (
          <Button
            icon={<Settings />}
            {...tooltip('Mode remote')}
            onClick={() => ctx.handleRemote(d)}
          />
        )}
        {ctx.isAdvanced && (
          <Button
            icon={<Trash2 />}
            color="error"
            {...tooltip('Supprimer')}
            onClick={() => ctx.deviceSync.delete(d.id)}
          />
        )}
      </div>
    ),
  ],
};

export const PairingForm = ({ onClose }: { onClose: () => void }) => {
  const [key, setKey] = useState('');
  const group = useMsg(groupId$);

  const handlePairing = async () => {
    if (!key) return;

    const cleanKey = key.toLowerCase().replace(/ /g, '');

    try {
      console.log('Tentative de pairage avec le code:', cleanKey);
      await apiGet(`pair/${cleanKey}/${group}`);
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
      <div class={c('Buttons')}>
        <Button title="Pairer l'écran" color="primary" onClick={handlePairing} />
      </div>
    </Form>
  );
};

export const DevicesPage = () => {
  const isAdvanced = useIsAdvanced();
  const medias = useGroupMedias();
  const devices = useGroupDevices();

  // search ? devices.filter((d) => isSearched(d.name, search)) : devices;

  const onlineMin = serverTime() - 10 * 1000;

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
    <Page class={c()}>
      <Toolbar title="Les écrans">
        <Button icon={<Plus />} color="primary" onClick={handleAdd}>
          Ajouter
        </Button>
        <SearchField />
      </Toolbar>
      <PageBody>
        <Grid
          cols={deviceCols}
          ctx={{ deviceSync, medias, onlineMin, handleRemote, isAdvanced }}
          items={devices}
        />
      </PageBody>
    </Page>
  );
};
