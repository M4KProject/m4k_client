import { Css } from '@common/ui';
import { toNbr, toError, retry, humanize } from '@common/utils';
import { Button } from '@common/components';
import { usePromise, useMsg } from '@common/hooks';
import { useEffect, useRef, useState } from 'preact/hooks';
import { openCodePinDialog } from '../components/CodePinView';
import { device$ } from '../services/device';
import {
  bgColor$,
  hasVideoMuted$,
  itemAnim$,
  itemDurationMs$,
  itemFit$,
  playlist$,
  url$,
} from '../messages';
import { m4k } from '@common/m4k';
import { logger } from '@common/utils';

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
    fCenter: [],
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
    fCenter: [],
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
    fCenter: [],
    position: 'absolute',
    inset: 0,
    zIndex: 20,
    fg: 'warn',
    m: 1,
  },
});

const KioskVideo = ({
  url,
  hasVideoMuted,
  gotoNext,
}: {
  url: string;
  hasVideoMuted?: boolean;
  gotoNext: () => void;
}) => {
  const ref = useRef<HTMLVideoElement>(null);
  const el = ref.current;

  useEffect(() => {
    if (!el) return;

    log.d(`Setting up video:`, url);

    // Configurer les attributs AVANT de charger la source
    el.setAttribute('playsinline', 'true');
    el.setAttribute('webkit-playsinline', 'true');
    el.setAttribute('autoplay', 'true');
    el.muted = hasVideoMuted ?? true;
    el.preload = 'auto';

    el.onloadstart = () => log.d(`Video loadstart:`, url);

    el.onloadedmetadata = () => {
      log.d(`Video metadata loaded - duration:`, el.duration, 'url:', url);
      // Forcer la lecture immédiatement après le chargement des métadonnées
      el.play().catch((e) => log.e(`Play error on metadata:`, e));
    };

    el.oncanplay = () => {
      log.d(`Video can play:`, url);
      // Double sécurité : relancer la lecture si elle n'a pas démarré
      if (el.paused) {
        el.play().catch((e) => log.e(`Play error on canplay:`, e));
      }
    };

    el.onerror = (e) => {
      log.e(`Video error:`, toError(e), url);
      setTimeout(() => gotoNext(), 1000);
    };

    el.onended = () => {
      log.d(`Video ended normally:`, url);
      gotoNext();
    };

    // Charger la source APRÈS avoir configuré tous les gestionnaires
    el.src = url;
    el.load();

    // Tentative de lecture immédiate (au cas où autoplay ne fonctionne pas)
    const playTimeout = setTimeout(() => {
      if (el.paused) {
        log.d(`Forcing play via timeout:`, url);
        el.play().catch((e) => log.e(`Play error on timeout:`, e));
      }
    }, 100);

    return () => clearTimeout(playTimeout);
  }, [el, url, hasVideoMuted, gotoNext]);

  return <video ref={ref} style={{ width: '100%', height: '100%' }} />;
};

const KioskItem = ({
  item,
  itemFit,
  itemAnim,
  hasVideoMuted,
  itemDurationMs,
  pos,
  gotoNext,
}: {
  item: PlaylistItem;
  itemFit?: string;
  itemAnim?: string;
  hasVideoMuted?: boolean;
  itemDurationMs?: number;
  pos: 'hidden' | 'prev' | 'curr' | 'next';
  gotoNext: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [info] = usePromise(() => m4k.fileInfo(item.path), [item]);

  const isCurr = pos === 'curr';
  const isImage = !!info && info.mimeType.startsWith('image');
  const isVideo = !!info && info.mimeType.startsWith('video');
  const duration = isImage ? toNbr(item.waitMs, itemDurationMs || 5000) : 0;

  useEffect(() => {
    const el = ref.current;
    if (!el || !isCurr) return;

    if (isVideo) {
      const handleEnded = () => gotoNext();
      const handleError = () => gotoNext();

      el.addEventListener('ended', handleEnded);
      el.addEventListener('error', handleError);

      return () => {
        el.removeEventListener('ended', handleEnded);
        el.removeEventListener('error', handleError);
      };
    } else if (isImage && duration > 0) {
      const timer = setTimeout(gotoNext, duration);
      return () => clearTimeout(timer);
    }
    return;
  }, [isCurr, isVideo, isImage, duration, gotoNext]);

  return (
    <div class={c('', itemFit && `-${itemFit}`, itemAnim && `-${itemAnim}`, `-${pos}`)}>
      {isVideo && isCurr && info && info.url ? (
        <KioskVideo url={info.url} gotoNext={gotoNext} hasVideoMuted={hasVideoMuted} />
      ) : isImage ? (
        <div ref={ref} style={{ backgroundImage: `url('${info?.url}')` }} />
      ) : (
        <span>
          Fichier: {item.path} Type: {info?.type}
        </span>
      )}
    </div>
  );
};

export const KioskPage = () => {
  const device = useMsg(device$);

  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);

  const url = useMsg(url$);
  const bgColor = useMsg(bgColor$).trim();
  const playlist = useMsg(playlist$);
  const itemDurationMs = useMsg(itemDurationMs$);
  const itemFit = useMsg(itemFit$);
  const itemAnim = useMsg(itemAnim$);
  const hasVideoMuted = useMsg(hasVideoMuted$);

  const items = playlist?.items?.filter((i) => i) || [];
  const length = items?.length || 0;

  const currIndex = count % length;
  const prevIndex = (currIndex - 1 + length) % length;
  const nextIndex = (currIndex + 1) % length;

  const curr = items[currIndex];
  const prev = items[prevIndex];
  const next = items[nextIndex];

  const gotoNext = () => setCount((count) => count + 1);

  log.d('KioskPage', { prev, curr, next, device });

  useEffect(() => {
    log.d('playlist', playlist$.v);
  }, []);

  // Si un contenu est associé au device, l'afficher via ContentViewer
  if (device?.media) {
    return (
      <div class={c('Container')}>
        {/* TODO media <ContentViewer contentKey={device?.media} /> */}
      </div>
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
      <div class={c('Container', 'Container-center')}>
        Aucun élément dans la playlist
        <Button color="primary" onClick={() => openCodePinDialog()}>
          Configurer
        </Button>
      </div>
    );
  }

  if (url && open) {
    return (
      <div class={c('Container')}>
        <iframe src={url.startsWith('http') ? url : `https://${url}`} />
      </div>
    );
  }

  return (
    <div
      class={c('Container')}
      style={bgColor ? { backgroundColor: bgColor } : {}}
      onClick={() => setOpen(true)}
    >
      {items.map((item, index) => (
        <KioskItem
          key={`${item.path}-${index}`}
          item={item}
          itemFit={itemFit || 'contain'}
          itemAnim={itemAnim || 'zoom'}
          hasVideoMuted={hasVideoMuted}
          itemDurationMs={itemDurationMs}
          gotoNext={gotoNext}
          pos={item === curr ? 'curr' : item === next ? 'next' : item === prev ? 'prev' : 'hidden'}
        />
      ))}
    </div>
  );
};
