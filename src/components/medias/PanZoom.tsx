import { addListener, Css } from '@common/ui';
import { DivProps } from '@common/components';
import { useRef, useEffect, useState, useMemo } from 'preact/hooks';
import { clamp } from '@common/utils';
import { useConstant } from '@common/hooks';

const c = Css('PanZoom', {
  '': {
    position: 'relative',
    overflow: 'hidden',
    wh: '100%',
    touchAction: 'none',
    userSelect: 'none',
  },
  Content: {
    position: 'absolute',
    inset: 0,
    transformOrigin: '0 0',
    transition: 'transform 0.05s ease',
  },
  '-animating Content': {
    transition: 'transform 0.3s ease',
  },
});

export type PanZoomProps = DivProps;

export const PanZoom = ({ children, ...props }: PanZoomProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const container = containerRef.current;

  const contentRef = useRef<HTMLDivElement>(null);
  const content = contentRef.current;

  const [isAnimating, setIsAnimating] = useState(false);
  const [style, setStyle] = useState<DivProps['style']>({});

  useEffect(() => {
    if (!container) return;

    let lastX = 0;
    let lastY = 0;
    let lastZoom = 1;
    let lastPointerXY: [number, number] = [0, 0];
    let lastTouches: TouchList | null = null;
    let isDragging = false;

    const applyTransform = (x: number, y: number, zoom: number, animate = false) => {
      lastX = x;
      lastY = y;
      lastZoom = zoom;

      setStyle({
        transform: `translate(${x}px, ${y}px) scale(${zoom})`,
      });

      if (animate) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);
      }
    };

    const getPointerXY = (event: MouseEvent | Touch): [number, number] => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return [0, 0];
      return [event.clientX - rect.left, event.clientY - rect.top];
    };

    const unsubscribes = [
      addListener(
        container,
        'wheel',
        (event) => {
          console.debug('PanZoom wheel', event);

          event.preventDefault();

          const delta = event.deltaY > 0 ? 0.9 : 1.1;
          const zoom = lastZoom * delta;
          const [pointerX, pointerY] = getPointerXY(event);
          const newX = pointerX - (pointerX - lastX) * (zoom / lastZoom);
          const newY = pointerY - (pointerY - lastY) * (zoom / lastZoom);

          applyTransform(newX, newY, zoom);
        },
        { passive: false }
      ),

      addListener(container, 'mousedown', (event) => {
        console.debug('PanZoom mousedown', event);

        event.preventDefault();

        isDragging = true;

        lastPointerXY = getPointerXY(event);
      }),

      addListener(0, 'mousemove', (event) => {
        console.debug('PanZoom mousemove', event);

        if (!isDragging) return;
        event.preventDefault();

        const pointerXY = getPointerXY(event);
        const [pointerX, pointerY] = pointerXY;
        const [lastPointerX, lastPointerY] = lastPointerXY;

        const deltaX = pointerX - lastPointerX;
        const deltaY = pointerY - lastPointerY;

        applyTransform(lastX + deltaX, lastY + deltaY, lastZoom);

        lastPointerXY = pointerXY;
      }),

      addListener(0, 'mouseup', (event) => {
        console.debug('PanZoom mouseup', event);

        event.preventDefault();

        isDragging = false;
      }),

      addListener(
        container,
        'touchstart',
        (event) => {
          console.debug('PanZoom touchstart', event);
          const touches = event.touches;

          event.preventDefault();

          lastTouches = touches;

          if (touches.length === 1 && touches[0]) {
            isDragging = true;
            lastPointerXY = getPointerXY(touches[0]);
          }
        },
        { passive: false }
      ),

      addListener(
        container,
        'touchmove',
        (event) => {
          console.debug('PanZoom touchmove', event);
          const touches = event.touches;

          event.preventDefault();

          // Single finger drag
          if (touches.length === 1 && isDragging && touches[0]) {
            const pointerXY = getPointerXY(touches[0]);
            const [pointerX, pointerY] = pointerXY;
            const [lastPointerX, lastPointerY] = lastPointerXY;

            const deltaX = pointerX - lastPointerX;
            const deltaY = pointerY - lastPointerY;

            applyTransform(lastX + deltaX, lastY + deltaY, lastZoom);

            lastPointerXY = pointerXY;
            lastTouches = touches;

            return;
          }

          // Two finger pinch zoom
          if (touches.length === 2 && lastTouches?.length === 2) {
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
            const oldTouch1 = lastTouches[0];
            const oldTouch2 = lastTouches[1];

            if (!touch1 || !touch2 || !oldTouch1 || !oldTouch2) return;

            const currentDistance = Math.sqrt(
              Math.pow(touch2.clientX - touch1.clientX, 2) +
                Math.pow(touch2.clientY - touch1.clientY, 2)
            );

            const oldDistance = Math.sqrt(
              Math.pow(oldTouch2.clientX - oldTouch1.clientX, 2) +
                Math.pow(oldTouch2.clientY - oldTouch1.clientY, 2)
            );

            if (oldDistance > 0) {
              const scale = currentDistance / oldDistance;
              const newZoom = lastZoom * scale;

              // Calculate center point
              const clientX = (touch1.clientX + touch2.clientX) / 2;
              const clientY = (touch1.clientY + touch2.clientY) / 2;
              const center = getPointerXY({ clientX, clientY } as MouseEvent);
              const [centerX, centerY] = center;

              const newX = centerX - (centerX - lastX) * (newZoom / lastZoom);
              const newY = centerY - (centerY - lastY) * (newZoom / lastZoom);

              applyTransform(newX, newY, newZoom);
            }

            lastTouches = touches;

            return;
          }
        },
        { passive: false }
      ),

      addListener(container, 'touchend', (event) => {
        console.debug('PanZoom touchend', event);
        const touches = event.touches;

        if (touches.length === 0) {
          isDragging = false;
          lastTouches = null;
        } else {
          lastTouches = touches;
        }
      }),
    ];

    return () => {
      for (const unsubscribe of unsubscribes) {
        unsubscribe();
      }
    };
  }, [container]);

  return (
    <div {...props} ref={containerRef} class={c('', isAnimating && '-animating', props)}>
      <div ref={contentRef} class={c('Content')} style={style}>
        {children}
      </div>
    </div>
  );
};
