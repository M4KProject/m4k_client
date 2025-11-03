import { onEvent, Css, Flux, flux, stopEvent, getEventXY, onHtmlEvent, XY, clear, setStyle, XYZ } from 'fluxio';
import { DivProps } from '@common/components';
import { useRef, useEffect, useState, useMemo } from 'preact/hooks';
import { useFlux } from '@common/hooks';

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

export interface PanZoomData {
  xy?: [number, number];
  scale?: number;
  isAnimating?: boolean;
  isDragging?: boolean;
  container?: HTMLDivElement;
  content?: HTMLDivElement;
  event?: Event;
  startXY?: [number, number];
  startTouches?: TouchList;
  eventXY?: [number, number];
}

export interface PanZoomInnerProps extends DivProps {
  translate$: Flux<XY>;
  scale$: Flux<number>;
  isDragging$: Flux<boolean>;
  container$: Flux<HTMLDivElement | undefined>;
  event$: Flux<Event | undefined>;
}

export class PanZoomController {
  readonly before$ = flux<Event|undefined>(undefined);
  readonly after$ = flux<Event|undefined>(undefined);
  readonly unsubscribes: (() => void)[];

  x = 0;
  y = 0;
  scale = 1;
  eventXY: [number, number]|undefined = undefined;
  touches: TouchList | null = null;
  isDragging = false;
  isAnimating = false;

  constructor(
    public readonly container: HTMLDivElement,
    public readonly content: HTMLDivElement,
  ) {
    this.unsubscribes = [
      onHtmlEvent(container, 'wheel', this.bind(this.onWheel)),
      onHtmlEvent(container, 'mousedown', this.bind(this.onMouseDown)),
      onHtmlEvent(0, 'mousemove', this.bind(this.onMouseMove)),
      onHtmlEvent(0, 'mouseup', this.bind(this.onMouseUp)),
      onHtmlEvent(container, 'touchstart', this.bind(this.onTouchStart)),
      onHtmlEvent(container, 'touchmove', this.bind(this.onTouchMove)),
      onHtmlEvent(container, 'touchend', this.bind(this.onTouchEnd)),
    ];
  }

  bind<E extends Event>(method: (event: E) => void): (event: E) => void {
    method = method.bind(this);
    return (event) => {
      console.debug('PanZoom event', event.type, event);
      this.before$.set(event);
      method(event);
      this.after$.set(event);
    }
  }

  onWheel(event: WheelEvent) {
    const delta = event.deltaY > 0 ? 0.9 : 1.1;
    const nextScale = this.scale * delta;
    const eventXY = getEventXY(event);
    if (!eventXY) return;
    stopEvent(event);
    const [x, y] = eventXY;
    const nextX = x - (x - this.x) * (nextScale / this.scale);
    const nextY = y - (y - this.y) * (nextScale / this.scale);
    this.eventXY = eventXY;
    this.applyTransform(nextX, nextY, nextScale);
  }

  onMouseDown(event: MouseEvent) {
    const eventXY = getEventXY(event);
    if (!eventXY) return;
    stopEvent(event);
    this.eventXY = eventXY;
    this.isDragging = true;
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;
    if (!this.eventXY) return;

    const eventXY = getEventXY(event);
    if (!eventXY) return;

    stopEvent(event);

    const [x, y] = eventXY;
    const [lastX, lastY] = this.eventXY;

    const nextX = lastX + x - lastX;
    const nextY = lastY + y - lastY;

    this.applyTransform(nextX, nextY, this.scale);

    this.eventXY = eventXY;
  }

  onMouseUp(event: MouseEvent) {
    if (!this.isDragging) return;
    stopEvent(event);
    this.isDragging = false;
  }

  onTouchStart(event: TouchEvent) {
    stopEvent(event);
    const touches = event.touches;
    this.touches = touches;
    this.isDragging = true;
    this.eventXY = getEventXY(event);
  }

  onTouchMove(event: TouchEvent) {
    if (!this.isDragging) return;
    if (!this.eventXY) return;

    stopEvent(event);

    const touches = event.touches;

    // Single finger drag
    if (touches.length === 1 && touches[0]) {
      const eventXY = getEventXY(touches[0]);
      if (!eventXY) return;

      const [x, y] = eventXY;
      const [lastX, lastY] = this.eventXY;

      const nextX = lastX + x - lastX;
      const nextY = lastY + y - lastY;

      this.applyTransform(nextX, nextY, this.scale);

      this.eventXY = eventXY;
      this.touches = touches;

      return;
    }

    // Two finger pinch zoom
    if (touches.length === 2 && this.touches?.length === 2) {
      const last1 = getEventXY(this.touches[0]);
      const last2 = getEventXY(this.touches[1]);

      const curr1 = getEventXY(touches[0]);
      const curr2 = getEventXY(touches[1]);

      if (!curr1 || !curr2 || !last1 || !last2) return;

      const currDistance = Math.sqrt(
        Math.pow(curr2[0] - curr1[0], 2) +
          Math.pow(curr2[1] - curr1[1], 2)
      );

      const lastDistance = Math.sqrt(
        Math.pow(last2[0] - last1[0], 2) +
          Math.pow(last2[1] - last1[1], 2)
      );

      if (lastDistance > 0) {
        const scale = currDistance / lastDistance;
        const newScale = this.scale * scale;

        // Calculate center point
        const x = (curr1[0] + curr2[0]) / 2;
        const y = (curr1[1] + curr2[1]) / 2;

        const newX = x - (x - this.x) * (newScale / this.scale);
        const newY = y - (y - this.y) * (newScale / this.scale);

        this.applyTransform(newX, newY, newScale);
      }

      this.touches = touches;

      return;
    }
  }

  onTouchEnd(event: TouchEvent) {
    if (!this.isDragging) return;
    
    stopEvent(event);

    const touches = event.touches;

    if (touches.length === 0) {
      this.isDragging = false;
      this.touches = null;
    } else {
      this.touches = touches;
    }
  }

  applyTransform(x: number, y:number, scale:number) {
    this.x = x;
    this.y = y;
    this.scale = scale;

    setStyle(this.content, {
      transform: `translate(${x}px, ${y}px) scale(${scale})`
    });
  }

  dispose() {
    for (const unsubscribe of this.unsubscribes) unsubscribe();
    clear(this.unsubscribes);
  }
}

export interface PanZoomProps extends DivProps {
  onNewController?: (controller: PanZoomController) => void;
}

export const PanZoom = ({ children, onNewController, ...props }: PanZoomProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const container = containerRef.current;

  const contentRef = useRef<HTMLDivElement>(null);
  const content = contentRef.current;

  useEffect(() => {
    if (!container) return;
    if (!content) return;

    const controller = new PanZoomController(container, content);
    onNewController?.(controller);

    return () => {
      controller.dispose();
    }
  }, [container, content]);

  return (
    <div {...props} {...c('', props)} ref={containerRef}>
      <div {...c('Content')} ref={contentRef}>
        {children}
      </div>
    </div>
  );
};
