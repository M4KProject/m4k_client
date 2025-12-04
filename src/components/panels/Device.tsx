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
import { Form } from '@/components/common/Form';
import { showDialog } from '@/components/common/Dialog';
import { Api } from '@/api/Api';
import { Panel } from './base/Panel';
import { useGroup, useRouter } from '@/hooks/useRoute';
import { useFlux } from '@/hooks/useFlux';

const c = Css('Device', {
  '': {
    my: 8,
    mx: 4,
    elevation: 1,
    rounded: 3,
    overflow: 'hidden',
    w: 250,
  },
  Header: {
    row: 1,
    bg: 'header',
    fg: 'headerFg',
  },
  Content: {
    m: 16,
    col: ['center', 'center'],
  },

  ' .Field-check': {
    w: 30,
  },
  ' input': {
    textAlign: 'center',
    border: 0,
    bg: 'transparent',
    fg: 'inherit',
  },
  ' .FieldLabel': {
    w: 55,
  },

  '-online': {},
  '-offline': {},

  '-selected': {
    elevation: 0,
    bg: 'body',
  },
  '-selected &Header': {
    row: 1,
    bg: 'primary'
  },
});

// const deviceCols: GridCols<
//   DeviceModel,
//   {
//     api: Api;
//     medias: MediaModel[];
//     onlineMin: number;
//     handleRemote: (device: DeviceModel) => void;
//     isAdvanced: boolean | undefined;
//   }
// > = {
//   key: [
//     'Clé',
//     (d, { api }) => (
//       <Button tooltip={d.id}>
//         <Field value={d.key} onValue={(key) => api.device.update(d.id, { key })} />
//       </Button>
//     ),
//     { if: (_col, ctx) => !!ctx.isAdvanced },
//   ],
//   type: [
//     'Type',
//     (d) => (
//       <Button tooltip={() => humanize(d.info)}>
//         <Field value={`${d.info?.type || ''} ${d.info?.version || ''}`} readonly />
//       </Button>
//     ),
//     { if: (_col, ctx) => !!ctx.isAdvanced },
//   ],
//   name: [
//     'Nom',
//     (d, { api }) => <Field value={d.name} onValue={(name) => api.device.update(d.id, { name })} />,
//   ],
//   resolution: ['Résolution', (d) => `${d.info?.width || 0}x${d.info?.height || 0}`],
//   online: [
//     'Online',
//     (d, ctx) => (
//     ),
//   ],
//   created: ['Création', (d) => formatDate(d.created)],
//   media: [
//     'Playlist',
//     (d, { api, medias }) => (
//       <Field
//         type="select"
//         items={medias
//           .filter((media) => media.type === 'content')
//           .map((media) => [media.id, media.title || media.key || media.id])}
//         value={d.media}
//         onValue={(media) => api.device.update(d.id, { media })}
//       />
//     ),
//   ],
//   actions: [
//     'Actions',
//     (d, { api, isAdvanced, handleRemote }) => (
//       <div style={{ display: 'flex', gap: '0.5em' }}>
//         <Button
//           icon={RefreshCw}
//           color="primary"
//           tooltip="Rafraîchir"
//           onClick={() => api.device.update(d.id, { action: 'reload' })}
//         />
//         <Button
//           icon={Power}
//           color="primary"
//           tooltip="Redémarrer"
//           onClick={() => api.device.update(d.id, { action: 'reboot' })}
//         />
//         {isAdvanced && (
//           <Button icon={Settings} tooltip="Mode remote" onClick={() => handleRemote(d)} />
//         )}
//         {isAdvanced && (
//           <Button
//             icon={Trash2}
//             color="error"
//             tooltip="Supprimer"
//             onClick={() => api.device.delete(d.id)}
//           />
//         )}
//       </div>
//     ),
//   ],
// };

  // const handleRemote = (device: DeviceModel) => {
  //   setDeviceKey(device.key || device.id);
  //   setPage('devices');
  // };

  // // const handleAddAsMember = async (device: DeviceModel) => {
  // //   if (!device.user || !groupId) return;
  // //   await collMembers.create({
  // //     device: device.id,
  // //     user: device.user,
  // //     group: groupId,
  // //     role: Role.viewer,
  // //   });
  // // };

export const PairingForm = ({ onClose }: { onClose: () => void }) => {
  const api = useApi();
  const [key, setKey] = useState('');
  const group = useGroup();

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

export const Device = ({ device }: { device: DeviceModel }) => {
  const api = useApi();
  const onlineMin = api.pb.getTime() - 10 * 1000;
  const router = useRouter();
  const selected = useFlux(router.deviceId$.map(id => device.id === id));

  return (
    <div
      {...c('', selected && '-selected')}
      onClick={() => router.deviceId$.set(device.id)}
    >
      <div {...c('Header')}>
        <Field
          type="check"
          value={selected}
          onValue={v => v && router.deviceId$.set(device.id)}
        />
        <Field
          value={device.name}
          onValue={(name) => {
            api.group.update(device.id, { name });
          }}
        />

{/* 

//       <Button tooltip={formatDateTime(toDate(d.online))}>
//         <Field type="switch" value={d.online && toTime(d.online) > ctx.onlineMin} readonly />
//       </Button>

         */}
      </div>
      <div {...c('Content')}>
        {/* <Field
          label="Clé"
          value={group.key}
          onValue={(key) => {
            api.group.update(group.id, { key });
          }}
        />
        <Field
          type="color"
          value={group.data?.primary}
          onValue={(primary) => {
            api.group.apply(group.id, (prev) => {
              prev.data = { ...prev.data, primary };
            });
          }}
        />
        <Field
          type="color"
          value={group.data?.secondary}
          onValue={(secondary) => {
            api.group.apply(group.id, (prev) => {
              prev.data = { ...prev.data, secondary };
            });
          }}
        /> */}
      </div>
    </div>
  )
}