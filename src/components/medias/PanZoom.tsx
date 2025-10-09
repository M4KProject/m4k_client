import { Css } from '@common/ui';
import { DivProps } from '@common/components';
import { useRef, useEffect, useState } from 'preact/hooks';

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
    transition: 'none',
  },
  '-animating Content': {
    transition: 'transform 0.3s ease',
  },
});

export type PanZoomProps = DivProps & {
  minZoom?: number;
  maxZoom?: number;
  initialZoom?: number;
  children?: any;
};

export const PanZoom = ({
  minZoom = 0.5,
  maxZoom = 3,
  initialZoom = 1,
  children,
  ...props
}: PanZoomProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [transform, setTransform] = useState({
    x: 0,
    y: 0,
    zoom: initialZoom,
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPointer, setLastPointer] = useState({ x: 0, y: 0 });
  const [touches, setTouches] = useState<TouchList | null>(null);

  // Apply transform
  const applyTransform = (x: number, y: number, zoom: number, animate = false) => {
    const clampedZoom = Math.max(minZoom, Math.min(maxZoom, zoom));
    setTransform({ x, y, zoom: clampedZoom });
    setIsAnimating(animate);
    if (animate) {
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  // Get pointer position relative to container
  const getPointerPos = (event: MouseEvent | Touch) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  // Handle wheel zoom
  const handleWheel = (event: WheelEvent) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = transform.zoom * delta;

    const pointer = getPointerPos(event);
    const newX = pointer.x - (pointer.x - transform.x) * (newZoom / transform.zoom);
    const newY = pointer.y - (pointer.y - transform.y) * (newZoom / transform.zoom);

    applyTransform(newX, newY, newZoom);
  };

  // Handle mouse down
  const handleMouseDown = (event: MouseEvent) => {
    event.preventDefault();
    setIsDragging(true);
    setLastPointer(getPointerPos(event));
  };

  // Handle mouse move
  const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging) return;
    event.preventDefault();

    const pointer = getPointerPos(event);
    const deltaX = pointer.x - lastPointer.x;
    const deltaY = pointer.y - lastPointer.y;

    applyTransform(transform.x + deltaX, transform.y + deltaY, transform.zoom);
    setLastPointer(pointer);
  };

  // Handle mouse up
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle touch start
  const handleTouchStart = (event: TouchEvent) => {
    event.preventDefault();
    setTouches(event.touches);

    if (event.touches.length === 1) {
      setIsDragging(true);
      setLastPointer(getPointerPos(event.touches[0]));
    }
  };

  // Handle touch move
  const handleTouchMove = (event: TouchEvent) => {
    event.preventDefault();

    if (event.touches.length === 1 && isDragging) {
      // Single finger drag
      const pointer = getPointerPos(event.touches[0]);
      const deltaX = pointer.x - lastPointer.x;
      const deltaY = pointer.y - lastPointer.y;

      applyTransform(transform.x + deltaX, transform.y + deltaY, transform.zoom);
      setLastPointer(pointer);
    } else if (event.touches.length === 2 && touches && touches.length === 2) {
      // Two finger pinch zoom
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const oldTouch1 = touches[0];
      const oldTouch2 = touches[1];

      // Calculate current distance
      const currentDistance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2)
      );

      // Calculate old distance
      const oldDistance = Math.sqrt(
        Math.pow(oldTouch2.clientX - oldTouch1.clientX, 2) +
          Math.pow(oldTouch2.clientY - oldTouch1.clientY, 2)
      );

      if (oldDistance > 0) {
        const scale = currentDistance / oldDistance;
        const newZoom = transform.zoom * scale;

        // Calculate center point
        const centerX = (touch1.clientX + touch2.clientX) / 2;
        const centerY = (touch1.clientY + touch2.clientY) / 2;
        const center = getPointerPos({ clientX: centerX, clientY: centerY } as MouseEvent);

        const newX = center.x - (center.x - transform.x) * (newZoom / transform.zoom);
        const newY = center.y - (center.y - transform.y) * (newZoom / transform.zoom);

        applyTransform(newX, newY, newZoom);
      }

      setTouches(event.touches);
    }
  };

  // Handle touch end
  const handleTouchEnd = (event: TouchEvent) => {
    if (event.touches.length === 0) {
      setIsDragging(false);
      setTouches(null);
    } else {
      setTouches(event.touches);
    }
  };

  // Setup event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Mouse events
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // Touch events
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, lastPointer, transform, touches]);

  return (
    <div {...props} ref={containerRef} class={c('', isAnimating && '-animating', props)}>
      <div
        ref={contentRef}
        class={c('Content')}
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
