import {
  Css,
  flux,
  formatDateTime,
  humanize,
  MINUTE,
  round,
  SECOND,
  serverTime,
  toDate,
  toItem,
  toTime,
} from 'fluxio';
import { useEffect } from 'preact/hooks';
import { Field } from '@/components/fields/Field';
import { Button } from '@/components/common/Button';
import { useRouter } from '@/hooks/useRoute';
import { useFlux } from '@/hooks/useFlux';
import { tooltipProps } from '../common/Tooltip';
import { Panel } from './base/Panel';
import { useConstant } from '@/hooks/useConstant';
import { EditIcon, InfoIcon } from 'lucide-react';
import { createWindow } from '../common/Window';
import { Medias } from './Medias';
import { useMediaController } from '@/hooks/useMediaController';
import { api2, MDevice, MUpdate } from '@/api2';
import { useMediaDico, useMedias } from '@/hooks/useApi2';

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

const useOnlineDelay = (online: string | Date | undefined) => {
  const delay$ = useConstant(() => flux<number>(0));

  useEffect(() => {
    const refresh = () => {
      const now = serverTime();
      const delay = online ? now - toTime(online) : 0;
      delay$.set(delay);
    };
    refresh();
    const interval = setInterval(refresh, 5 * SECOND);
    return () => clearInterval(interval);
  }, [online]);

  return useFlux(delay$);
};

export const Device = ({ device }: { device: MDevice }) => {
  const router = useRouter();
  const selected = useFlux(api2.devices.id$.map((id) => device.id === id));
  const delay = useOnlineDelay(device.online);
  const seconds = round(delay / SECOND);
  const onlineCls =
    delay < 10 * SECOND ? '-online'
    : delay < MINUTE ? '-latency'
    : '-offline';

  const contents = useMedias().filter((m) => m.type === 'content');

  const update = (changes: MUpdate<MDevice>) => {
    api2.devices.update(device.id, changes);
  };

  const info = toItem(device.info);

  const mediaId = device.mediaId;
  const mediaDico = useMediaDico();
  const media = mediaDico[mediaId];
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
        update({ mediaId });
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
            onValue={(v) => v && api2.devices.select(device)}
          />
          <Field value={device.name} onValue={(name) => update({ name })} />
          <div
            {...c('Online')}
            {...tooltipProps(`${seconds} ${formatDateTime(toDate(device.online))}`)}
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
        <Button title={media?.name} color="primary" onClick={handleMedia} />
        <Button
          color="primary"
          icon={EditIcon}
          onClick={() => {
            if (device.mediaId) {
              router.screenSize$.set([device.width || 1920, device.height || 1080]);
              router.go({ page: 'edit', mediaId: device.mediaId });
            }
          }}
        />
      </div>
    </Panel>
  );
};
