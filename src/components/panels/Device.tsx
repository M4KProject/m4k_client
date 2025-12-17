import {
  Css,
  flux,
  formatDateTime,
  humanize,
  MINUTE,
  round,
  SECOND,
  toDate,
  toItem,
  toTime,
} from 'fluxio';
import { useEffect } from 'preact/hooks';
import { useApi, useGroupMedias, useMediaById } from '@/hooks/useApi';
import { DeviceModel } from '@/api/models';
import { Field } from '@/components/fields/Field';
import { Button } from '@/components/common/Button';
import { useMedia, useRouter } from '@/hooks/useRoute';
import { useFlux, useFluxMemo } from '@/hooks/useFlux';
import { tooltipProps } from '../common/Tooltip';
import { Panel } from './base/Panel';
import { useConstant } from '@/hooks/useConstant';
import { PbUpdate } from 'pblite';
import { EditIcon, InfoIcon } from 'lucide-react';
import { createWindow } from '../common/Window';
import { Medias } from './Medias';
import { useMediaController } from '@/hooks/useMediaController';

const c = Css('Device', {
  '': { w: 300, h: 200 },
  Online: {
    whMin: 18,
    rounded: 999,
    mx: 6,
  },
  ' .PanelContent': { col: 1 },
  '-online &Online': { bg: 'success' },
  '-latency &Online': { bg: 'black' },
  '-offline &Online': { bg: 'error' },
  '-offline .PanelHeader': { bg: 'error' },
  ' .Field-check': { w: 30 },
  ' input': {
    textAlign: 'center',
    border: 0,
    bg: 'transparent',
    fg: 'inherit',
  },
  ' .FieldLabel': {
    w: 55,
  },
  '-selected .PanelHeader': {
    row: 1,
    bg: 'primary',
  },
  Footer: {
    row: 1,
    w: '100%',
  },
  Media: {
    flex: 1,
    w: 'auto',
  },
  Capture: {
    flex: 1,
    bg: 'black',
  },
});

//   type: [
//     'Type',
//     (d) => (
//     ),
//     { if: (_col, ctx) => !!ctx.isAdvanced },
//   ],
//   name: [
//     'Nom',
//     (d, { api }) => <Field value={d.name} onValue={(name) => api.device.update(d.id, { name })} />,
//   ],
//   resolution: ['Résolution', (d) => `${d.info?.width || 0}x${d.info?.height || 0}`],
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

const useOnlineDelay = (online: string | Date | undefined) => {
  const api = useApi();
  const delay$ = useConstant(() => flux<number>(0));

  useEffect(() => {
    const refresh = () => {
      const now = api.pb.getTime();
      const delay = online ? now - toTime(online) : 0;
      delay$.set(delay);
    };
    refresh();
    const interval = setInterval(refresh, 5 * SECOND);
    return () => clearInterval(interval);
  }, [online]);

  return useFlux(delay$);
};

export const Device = ({ device }: { device: DeviceModel }) => {
  const api = useApi();
  const router = useRouter();
  const selected = useFlux(router.deviceId$.map((id) => device.id === id));

  const delay = useOnlineDelay(device.online);
  const seconds = round(delay / SECOND);
  const onlineCls =
    delay < 10 * SECOND ? '-online'
    : delay < MINUTE ? '-latency'
    : '-offline';

  const contents = useGroupMedias().filter((m) => m.type === 'content');

  const update = (changes: PbUpdate<DeviceModel>) => {
    api.device.update(device.id, changes);
  };

  const info = toItem(device.info);

  const mediaId = device.media;
  const media = useFluxMemo(() => api.media.find$({ id: mediaId }), [api, mediaId]);
  const mediaController = useMediaController();

  const handleMedia = (e: Event) => {
    createWindow({
      // target: e,
      modal: true,
      title: 'Sélectionner un média',
      content: Medias,
      cancel: () => {},
      confirm: () => {
        const mediaId = mediaController.select$.get()?.id;
        if (!mediaId) return;
        update({ media: mediaId });
      },
      size: [800, 600],
      min: [400, 300],
    });
  };

  return (
    <Panel
      {...c('', selected && '-selected', onlineCls)}
      header={
        <>
          <Field
            type="check"
            value={selected}
            onValue={(v) => v && router.deviceId$.set(device.id)}
          />
          <Field value={device.name} onValue={(name) => update({ name })} />
          <div
            {...c('Online')}
            {...tooltipProps(`${seconds} ${formatDateTime(toDate(device.online))}`)}
            onClick={() => update({ online: api.pb.getDate() })}
          />
        </>
      }
    >
      <div {...c('Capture')}></div>
      <div {...c('Footer')}>
        <Button
          icon={InfoIcon}
          tooltip={() => <pre>{humanize({ id: device.id, key: device.key, ...info })}</pre>}
        />
        <Button title={media?.title} color="primary" onClick={handleMedia} />
        {/* <Field
          containerProps={c('Media')}
          type="select"
          value={device.media}
          onValue={(media) => update({ media })}
          items={contents.map((m) => [m.id, m.title])}
        /> */}
        <Button
          color="primary"
          icon={EditIcon}
          onClick={() => {
            if (device.media) {
              router.screenSize$.set([info.width || 1920, info.height || 1080]);
              router.go({ page: 'edit', media: device.media });
            }
            // TODO else crée le media
          }}
        />
      </div>
    </Panel>
  );
};
