import { useRef, useEffect, useState, useMemo } from 'preact/hooks';
import { ComponentChildren } from 'preact';
import { Msg, uuid } from '@common/utils';
import { useMsg } from '@common/hooks';
import { Css } from '@common/ui';

const over$ = new Msg('');

const c = Css('Popover', {
  '': {
    position: 'relative',
    xy: 0,
    wh: '100%',
    userSelect: 'none',
  },
  Float: {
    position: 'absolute',
    p: 0.2,
    xy: '50%',
    wh: '100%',
    translate: '-50%, -50%',
    bgMode: 'contain',
    transition: 0.2,
    userSelect: 'none',
    fCol: ['center', 'space-around'],
  },
  Title: {
    opacity: 0,
    transition: 0.2,
    hMax: 0,
    fontSize: 0.8,
  },
  '-over &Float': {
    xy: '50%',
    wh: 15,
    zIndex: 100,
    translate: '-50%, -50%',
    rounded: 1,
    bg: 'bg',
    bgMode: 'contain',
    elevation: 2,
  },
  '-over &Title': {
    opacity: 1,
    hMax: 3,
    m: 0.2,
  },
});

export const useIsOver = (id: string) => useMsg(over$) === id;

export const setIsOver = (id: string, next: boolean) =>
  next ? over$.set(id) : over$.next((p) => (p === id ? '' : p));

interface PopoverProps {
  id?: string;
  children: ComponentChildren;
  class?: string;
  title?: string;
}

export const Popover = ({ id, children, class: className = '', title }: PopoverProps) => {
  const overId = useMemo(() => id || uuid(), [id]);
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useMsg(over$) === overId;
  const [position, setPosition] = useState({
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  });

  useEffect(() => {
    if (isVisible && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const previewSize = 15 * 16; // 15rem convertis en px (approximation)

      let top = '50%';
      let transform = 'translate(-50%, -50%)';

      // Si trop près du haut
      if (rect.top < previewSize / 2) {
        top = '0%';
        transform = 'translate(-50%, 0%)';
      }
      // Si trop près du bas
      else if (rect.bottom + previewSize / 2 > viewportHeight) {
        top = '100%';
        transform = 'translate(-50%, -100%)';
      }

      setPosition({ top, left: '50%', transform });
    }
  }, [isVisible]);

  return (
    <div
      ref={containerRef}
      class={c('', isVisible && `-over`, className)}
      onMouseOver={() => setIsOver(overId, true)}
      onMouseLeave={() => setIsOver(overId, false)}
      style={isVisible ? position : undefined}
    >
      <div class={c('Float')}>
        {children}
        {title && <span class={c('Title')}>{title}</span>}
      </div>
    </div>
  );
};
