import { Css } from 'fluxio';
import { jsonStringify, toDate, toError, toTime } from 'fluxio';
import { RefreshCw, Trash2, Settings, Plus, Power } from 'lucide-react';
import { useState } from 'preact/hooks';
import { SearchField } from '../components/SearchField';
import { setDeviceKey, setPage } from '../../router/setters';
import { useIsAdvanced } from '@/router/hooks';
import { useApi, useGroupDevices, useGroupMedias } from '@/hooks/apiHooks';
import { formatDate, formatDateTime } from 'fluxio';
import { getPbClient } from 'pblite';
import { Grid, GridCols } from '@/components/Grid';
import { DeviceModel, MediaModel } from '@/api/models';
import { Field } from '@/components/Field';
import { tooltip } from '@/components/Tooltip';
import { Button } from '@/components/Button';
import { useFlux } from '@/hooks/useFlux';
import { groupId$ } from '@/api/groupId$';
import { Form } from '@/components/Form';
import { showDialog } from '@/components/Dialog';
import { Page, PageBody } from '@/components/Page';
import { Toolbar } from '@/components/Toolbar';
import { ApiCtrl } from '@/api/ApiCtrl';

const c = Css('DevicesPage', {
  Buttons: {
    row: ['center', 'around'],
  },
});

const deviceCols: GridCols<
  DeviceModel,
  {
    api: ApiCtrl;
    medias: MediaModel[];
    onlineMin: number;
    handleRemote: (device: DeviceModel) => void;
    isAdvanced: boolean | undefined;
  }
> = {
  key: [
    'Clé',
    (d, { api }) => (
      <Field
        {...tooltip(d.id)}
        value={d.key}
        onValue={(key) => api.device.update(d.id, { key })}
      />
    ),
    { if: (_col, ctx) => !!ctx.isAdvanced },
  ],
  type: [
    'Type',
    (d) => (
      <Field
        {...tooltip(() => jsonStringify(d.info))}
        value={`${d.info?.type || ''} ${d.info?.version || ''}`}
        readonly
      />
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
          icon={<RefreshCw />}
          color="primary"
          {...tooltip('Rafraîchir')}
          onClick={() => api.device.update(d.id, { action: 'reload' })}
        />
        <Button
          icon={<Power />}
          color="primary"
          {...tooltip('Redémarrer')}
          onClick={() => api.device.update(d.id, { action: 'reboot' })}
        />
        {isAdvanced && (
          <Button
            icon={<Settings />}
            {...tooltip('Mode remote')}
            onClick={() => handleRemote(d)}
          />
        )}
        {isAdvanced && (
          <Button
            icon={<Trash2 />}
            color="error"
            {...tooltip('Supprimer')}
            onClick={() => api.device.delete(d.id)}
          />
        )}
      </div>
    ),
  ],
};

export const PairingForm = ({ onClose }: { onClose: () => void }) => {
  const [key, setKey] = useState('');
  const group = useFlux(groupId$);

  const handlePairing = async () => {
    if (!key) return;

    const cleanKey = key.toLowerCase().replace(/ /g, '');

    try {
      console.log('Tentative de pairage avec le code:', cleanKey);
      await getPbClient().req('GET', `pair/${cleanKey}/${group}`);
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

export const DevicesPage = () => {
  const api = useApi();
  const isAdvanced = useIsAdvanced();
  const medias = useGroupMedias();
  const devices = useGroupDevices();

  // search ? devices.filter((d) => isSearched(d.name, search)) : devices;

  const onlineMin = getPbClient().getTime() - 10 * 1000;

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
    <Page {...c()}>
      <Toolbar title="Les écrans">
        <Button icon={<Plus />} color="primary" onClick={handleAdd}>
          Ajouter
        </Button>
        <SearchField />
      </Toolbar>
      <PageBody>
        <Grid
          cols={deviceCols}
          ctx={{ api, medias, onlineMin, handleRemote, isAdvanced }}
          items={devices}
        />
      </PageBody>
    </Page>
  );
};
