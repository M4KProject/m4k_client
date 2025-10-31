import { useRef, useEffect, useMemo } from 'preact/hooks';
import { ComponentChildren } from 'preact';
import { Flux, uuid } from 'fluxio';
import { useFlux } from '@common/hooks';
import { Css } from '@common/ui';

const over$ = new Flux('');

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
  },
  '-over &Float': {
    xy: '50%',
    wh: 15,
    zIndex: 100,
    translate: '-50%, -50%',
    rounded: 1,
    bg: 'b1',
    bgMode: 'contain',
    elevation: 3,
  },
  '-over &Title': {
    opacity: 1,
    hMax: 3,
    m: 0.2,
  },
});

export const useIsOver = (id: string) => useFlux(over$) === id;

export const setIsOver = (id: string, next: boolean) =>
  next ? over$.set(id) : over$.set((p) => (p === id ? '' : p));

interface PopoverProps {
  id?: string;
  children: ComponentChildren;
  class?: string;
  title?: string;
}

export const Popover = ({ id, children, class: className = '', title }: PopoverProps) => {
  const overId = useMemo(() => id || uuid(), [id]);
  const floatRef = useRef<HTMLDivElement>(null);
  const isOver = useFlux(over$) === overId;

  useEffect(() => {
    const el = floatRef.current;
    if (el) {
      if (isOver) {
        const rect = el.getBoundingClientRect();
        console.debug('Popover el', el, rect);
        if (rect.y < 110) {
          el.style.marginTop = '120px';
        }
      } else {
        el.style.marginTop = '0';
      }
    }
  }, [isOver]);

  return (
    <div
      {...c('', isOver && `-over`, className)}
      onMouseOver={() => setIsOver(overId, true)}
      onMouseLeave={() => setIsOver(overId, false)}
    >
      <div ref={floatRef} {...c('Float')}>
        {children}
        {title && <span {...c('Title')}>{title}</span>}
      </div>
    </div>
  );
};
