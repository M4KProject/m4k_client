import { setCss } from '@common/ui';
import { repeat } from '@common/utils';
import { newMsg } from '@common/utils/Msg';

export type ContentRotation = 0 | 90 | 180 | 270;
export const isContentRotation = (v: number) => v === 0 || v === 90 || v === 180 || v === 270;
export const contentRotation$ = newMsg<0 | 90 | 180 | 270>(
  0,
  'contentRotation',
  true,
  isContentRotation
);

const applyContentRotation = () => {
  const v = contentRotation$.v;
  console.debug('apply contentRotation', v);

  let w = window.innerWidth;
  let h = window.innerHeight;

  if (v === 90 || v === 270) {
    const t = w;
    w = h;
    h = t;
  }

  setCss(
    'contentRotation',
    v === 0
      ? {}
      : {
          body: {
            w: w + 'px',
            h: h + 'px',
            transform: `rotate(${v}deg)`,
            transformOrigin: '50% 50%',
            position: 'fixed',
            top: '50%',
            left: '50%',
            marginTop: -h / 2 + 'px',
            marginLeft: -w / 2 + 'px',
            overflow: 'hidden',
          },
        }
  );
};

contentRotation$.on(applyContentRotation);

repeat(10, (i) => {
  setTimeout(applyContentRotation, i * 1000);
});

// Reset WebView zoom (for Android virtual keyboard issues)
const resetZoom = () => {
  if (typeof document !== 'undefined') {
    // Reset viewport zoom
    let viewport = document.querySelector('meta[name=viewport]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      document.head.appendChild(viewport);
    }
    viewport.setAttribute(
      'content',
      'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
    );
  }
};

// Also listen to window resize events
if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    setTimeout(resetZoom, 100);
    setTimeout(applyContentRotation, 200);
  });

  // Reset zoom periodically to fix keyboard issues
  setInterval(() => {
    resetZoom();
    applyContentRotation();
  }, 10 * 1000);
}
