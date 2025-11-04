import { Css, Flux, flux, stopEvent, getEventXY, onHtmlEvent, XY, clear, setStyle } from 'fluxio';
import { DivProps } from '@common/components';
import { useRef, useEffect } from 'preact/hooks';

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
    // inset: 0,
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
  readonly before$ = flux<Event | undefined>(undefined);
  readonly after$ = flux<Event | undefined>(undefined);
  readonly unsubscribes: (() => void)[];

  xy: [number, number] = [0, 0];
  x = 0;
  y = 0;
  scale = 1;
  w = 0;
  h = 0;
  eventXY: [number, number] | undefined = undefined;
  touches: TouchList | null = null;
  isDragging = false;
  isAnimating = false;

  constructor(
    public readonly container: HTMLDivElement,
    public readonly content: HTMLDivElement
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
      // console.debug('PanZoom event', event.type, event);
      this.before$.set(event);
      method(event);
      this.after$.set(event);
    };
  }

  onWheel(event: WheelEvent) {
    const delta = event.deltaY > 0 ? 0.9 : 1.1;
    const prevScale = this.scale;
    const nextScale = prevScale * delta;
    const xy = getEventXY(event);
    if (!xy) return;
    stopEvent(event);
    const rect = this.container.getBoundingClientRect();
    const x = xy[0] - rect.x;
    const y = xy[1] - rect.y;
    const nextX = x - (x - this.x) * (nextScale / prevScale);
    const nextY = y - (y - this.y) * (nextScale / prevScale);
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

    const nextX = this.x + (x - lastX);
    const nextY = this.y + (y - lastY);

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

      const nextX = this.x + (x - lastX);
      const nextY = this.y + (y - lastY);

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
        Math.pow(curr2[0] - curr1[0], 2) + Math.pow(curr2[1] - curr1[1], 2)
      );

      const lastDistance = Math.sqrt(
        Math.pow(last2[0] - last1[0], 2) + Math.pow(last2[1] - last1[1], 2)
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

  applyTransform(x: number, y: number, scale: number) {
    this.x = x;
    this.y = y;
    this.scale = scale;

    setStyle(this.content, {
      transform: `translate(${x}px, ${y}px) scale(${scale})`,
    });
  }

  getSize(): [number, number] {
    return [this.w || this.content.scrollWidth, this.h || this.content.scrollHeight];
  }

  setSize(w: number, h: number) {
    this.w = w;
    this.h = h;
    setStyle(this.content, { width: `${w}px`, height: `${h}px` });
    this.fitToContainer();
  }

  center() {
    const containerRect = this.container.getBoundingClientRect();
    const contentRect = this.content.getBoundingClientRect();

    const x = (containerRect.width - contentRect.width / this.scale) / 2;
    const y = (containerRect.height - contentRect.height / this.scale) / 2;

    this.applyTransform(x, y, this.scale);
  }

  fitToContainer() {
    const containerRect = this.container.getBoundingClientRect();

    const [contentWidth, contentHeight] = this.getSize();

    const scaleX = containerRect.width / contentWidth;
    const scaleY = containerRect.height / contentHeight;
    const scale = Math.min(scaleX, scaleY) * 0.95;

    const x = (containerRect.width - contentWidth * scale) / 2;
    const y = (containerRect.height - contentHeight * scale) / 2;

    this.applyTransform(x, y, scale);
  }

  zoomIn() {
    const containerRect = this.container.getBoundingClientRect();
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;

    const nextScale = this.scale * 1.2;
    const nextX = centerX - (centerX - this.x) * (nextScale / this.scale);
    const nextY = centerY - (centerY - this.y) * (nextScale / this.scale);

    this.applyTransform(nextX, nextY, nextScale);
  }

  zoomOut() {
    const containerRect = this.container.getBoundingClientRect();
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;

    const nextScale = this.scale / 1.2;
    const nextX = centerX - (centerX - this.x) * (nextScale / this.scale);
    const nextY = centerY - (centerY - this.y) * (nextScale / this.scale);

    this.applyTransform(nextX, nextY, nextScale);
  }

  resetZoom() {
    this.center();
    this.applyTransform(this.x, this.y, 1);
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
    };
  }, [container, content]);

  return (
    <div {...props} {...c('', props)} ref={containerRef}>
      <div {...c('Content')} ref={contentRef}>
        {children}
      </div>
    </div>
  );
};
