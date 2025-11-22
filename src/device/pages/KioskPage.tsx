import { Css } from 'fluxio';
import { toNumber } from 'fluxio';
import { useEffect, useRef, useState } from 'preact/hooks';
import { openCodePinDialog } from '@/admin/components/CodePinView';
import { bgColor$, itemAnim$, itemDurationMs$, itemFit$, playlist$, url$ } from '@/device/messages';
import { m4k } from '@/m4kBridge';
import { logger } from 'fluxio';
import { KioskVideo } from '@/admin/components/KioskVideo';
import { usePromise } from '@/hooks/usePromise';
import { useFlux } from '@/hooks/useFlux';
import { Button } from '@/components/Button';
import { useDeviceCtrl } from '@/device/controllers/DeviceCtrl';

const log = logger('KioskPage');

type PlaylistItem = any;

const c = Css('Kiosk', {
  Container: {
    position: 'fixed',
    inset: 0,
    overflow: 'hidden',
    bg: '#000',
  },
  'Container-center': {
    center: 1,
  },
  'Container iframe': {
    position: 'fixed',
    overflow: 'hidden',
    inset: 0,
    border: 0,
    w: '100%',
    h: '100%',
    bg: '#fff',
  },

  '': {
    center: 1,
    position: 'absolute',
    overflow: 'hidden',
    inset: 0,
    color: '#fff',
    transition: 'all 0.3s ease',
    zIndex: 1,
    bg: '#000',
    // bg: '#f00',
  },
  '-hidden': { visibility: 'hidden', opacity: 0 },
  '-prev': { zIndex: 3, opacity: 0 },
  '-next': { zIndex: 2, opacity: 0 },
  '-curr': { zIndex: 4, opacity: 1 },

  '-rightToLeft&-hidden, &-rightToLeft&-prev': { transform: 'translateX(-100%)' },
  '-rightToLeft&-next': { transform: 'translateX(+100%)' },

  '-topToBottom&-hidden, &-topToBottom&-prev': { transform: 'translateY(+100%)' },
  '-topToBottom&-next': { transform: 'translateY(-100%)' },

  '-zoom&-hidden, &-zoom&-prev, &-zoom&-next': { transform: 'scale(0)' },

  ' div': { width: '100%', height: '100%', bgMode: 'fill' },
  '-contain div': { bgMode: 'contain' },
  '-cover div': { bgMode: 'cover' },

  ' video': { itemFit: 'fill' },
  '-contain video': { itemFit: 'contain' },
  '-cover video': { itemFit: 'cover' },

  ' span': {
    center: 1,
    position: 'absolute',
    inset: 0,
    zIndex: 20,
    fg: 'warn',
    m: 8,
  },
});

const KioskItem = ({
  item,
  itemFit,
  itemAnim,
  itemDurationMs,
  pos,
  onNext,
}: {
  item: PlaylistItem;
  itemFit?: string;
  itemAnim?: string;
  itemDurationMs?: number;
  pos: 'hidden' | 'prev' | 'curr' | 'next';
  onNext: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [info] = usePromise(() => m4k.fileInfo(item.path), [item]);

  const isCurr = pos === 'curr';
  const isImage = !!info && info.mimeType.startsWith('image');
  const isVideo = !!info && info.mimeType.startsWith('video');
  const duration = isImage ? toNumber(item.waitMs, itemDurationMs || 5000) : 0;

  useEffect(() => {
    const el = ref.current;
    if (!el || !isCurr) return;

    if (isVideo) {
      const handleEnded = () => onNext();
      const handleError = () => onNext();

      el.addEventListener('ended', handleEnded);
      el.addEventListener('error', handleError);

      return () => {
        el.removeEventListener('ended', handleEnded);
        el.removeEventListener('error', handleError);
      };
    } else if (isImage && duration > 0) {
      const timer = setTimeout(onNext, duration);
      return () => clearTimeout(timer);
    }
    return;
  }, [isCurr, isVideo, isImage, duration, onNext]);

  return (
    <div {...c('', itemFit && `-${itemFit}`, itemAnim && `-${itemAnim}`, `-${pos}`)}>
      {isVideo && info && info.url ?
        <KioskVideo isCurr={isCurr} url={info.url} onNext={onNext} />
      : isImage ?
        <div ref={ref} style={{ backgroundImage: `url('${info?.url}')` }} />
      : <span>
          Fichier: {item.path} Type: {info?.type}
        </span>
      }
    </div>
  );
};

export const KioskPage = () => {
  const deviceCtrl = useDeviceCtrl();
  const device = useFlux(deviceCtrl.device$);

  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);

  const url = useFlux(url$);
  const bgColor = useFlux(bgColor$).trim();
  const playlist = useFlux(playlist$);
  const itemDurationMs = useFlux(itemDurationMs$);
  const itemFit = useFlux(itemFit$);
  const itemAnim = useFlux(itemAnim$);

  const items = playlist?.items?.filter((i) => i) || [];
  const length = items?.length || 0;

  const currIndex = count % length;
  const prevIndex = (currIndex - 1 + length) % length;
  const nextIndex = (currIndex + 1) % length;

  const curr = items[currIndex];
  const prev = items[prevIndex];
  const next = items[nextIndex];

  const onNext = () => setCount((count) => count + 1);

  log.d('KioskPage', { prev, curr, next, device });

  useEffect(() => {
    log.d('playlist', playlist$.get());
  }, []);

  // Si un contenu est associé au device, l'afficher via ContentViewer
  if (device?.media) {
    return (
      <div {...c('Container')}>{/* TODO media <ContentViewer contentKey={device?.media} /> */}</div>
    );
  }

  // if (url) {
  //     return (
  //         <Iframe style={{}}>
  //             {url}
  //         </Iframe>
  //     )
  // }

  if (length === 0) {
    return (
      <div {...c('Container', 'Container-center')}>
        Aucun élément dans la playlist
        <Button color="primary" onClick={() => openCodePinDialog()}>
          Configurer
        </Button>
      </div>
    );
  }

  if (url && open) {
    return (
      <div {...c('Container')}>
        <iframe src={url.startsWith('http') ? url : `https://${url}`} />
      </div>
    );
  }

  return (
    <div
      {...c('Container')}
      style={bgColor ? { backgroundColor: bgColor } : {}}
      onClick={() => setOpen(true)}
    >
      {items.map((item, index) => (
        <KioskItem
          key={`${item.path}-${index}`}
          item={item}
          itemFit={itemFit || 'contain'}
          itemAnim={itemAnim || 'zoom'}
          itemDurationMs={itemDurationMs}
          onNext={onNext}
          pos={
            item === curr ? 'curr'
            : item === next ?
              'next'
            : item === prev ?
              'prev'
            : 'hidden'
          }
        />
      ))}
    </div>
  );
};
