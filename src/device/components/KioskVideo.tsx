import { useEffect, useRef } from 'preact/hooks';
import { logger } from 'fluxio';
import { Css } from '@common/ui';
import { useConstant, useFlux } from '@common/hooks';
import { hasVideoMuted$ } from '../messages';

const log = logger('KioskVideo');

const c = Css('Kiosk', {
  '': {},
});

export const KioskVideo = ({
  url,
  isCurr,
  onNext,
}: {
  url: string;
  isCurr: boolean;
  onNext: () => void;
}) => {
  const ref = useRef<HTMLVideoElement>(null);
  const el = ref.current;
  const hasVideoMuted = useFlux(hasVideoMuted$);

  const tryPlay = () => {
    if (el && el.paused && !el.ended && v.isCurr) {
      el.play().catch((e) => log.e(`tryPlay error:`, e));
    }
  };

  const v = useConstant(() => ({ isCurr, onNext, url, tryPlay }));
  v.isCurr = isCurr;
  v.onNext = () => isCurr && onNext();
  v.url = url;
  v.tryPlay = tryPlay;

  useEffect(() => {
    if (!el) return;

    log.d(`useEffect`, url);

    el.muted = hasVideoMuted;
    el.defaultMuted = hasVideoMuted;

    el.onloadstart = () => {
      log.d(`onloadstart`, v);
      v.tryPlay();
    };

    el.onloadedmetadata = () => {
      log.d(`onloadedmetadata`, v, el.duration);
      v.tryPlay();
    };

    el.oncanplay = () => {
      log.d(`oncanplay`, v);
      v.tryPlay();
    };

    el.oncanplaythrough = () => {
      log.d(`oncanplaythrough`, v);
      v.tryPlay();
    };

    el.onpause = () => {
      log.d(`onpause`, v);
      v.onNext();
    };

    el.onerror = (e) => {
      log.e(`onerror`, v);
      v.onNext();
    };

    el.onended = () => {
      log.d(`onended`, v);
      v.onNext();
    };

    el.src = url;
    el.load();
  }, [el, url]);

  useEffect(() => {
    log.d(`useEffect2`, v);
    if (!el) return;

    if (!isCurr) {
      if (!el.paused) {
        el.pause();
      }
      return;
    }

    const playAttempts = [0, 100, 250, 500, 1000, 2000, 5000];
    const timeouts = playAttempts.map((delay) => setTimeout(tryPlay, delay));

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [el, isCurr, url]);

  return (
    <video
      class={c('')}
      ref={ref}
      src={url}
      playsinline
      webkit-playsinline="true"
      autoplay
      muted={hasVideoMuted}
      preload="auto"
      disablePictureInPicture
      style={{ width: '100%', height: '100%' }}
    />
  );
};
