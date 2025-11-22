import { Css, Flux, onHtmlEvent, Unsubscribe, stopEvent } from 'fluxio';
import { useFlux } from '@/hooks/useFlux';
import { portal } from './Portal';
import { Content, DivProps } from './types';
import { getContent } from './getContent';
import { useEffect, useMemo } from 'preact/hooks';
import { X } from 'lucide-react';
import { Button } from './Button';

type ResizeDir = [number, number, number, number]; // [xDir, yDir, wDir, hDir]
type EdgeStyle = { cursor: string; top?: string; left?: string; right?: string; bottom?: string; width?: string; height?: string };

const S = 8; // edge hit size
const H = 0.5;

// [name, [xDir, yDir, wDir, hDir], [top, left, cursor]]
const EDGES: [string, ResizeDir, [number | string, number | string, string]][] = [
  ['n', [0, 1, 0, -1], [0, H, 'ns-resize']],
  ['s', [0, 0, 0, 1], ['auto', H, 'ns-resize']],
  ['e', [0, 0, 1, 0], [H, 'auto', 'ew-resize']],
  ['w', [1, 0, -1, 0], [H, 0, 'ew-resize']],
  ['ne', [0, 1, 1, -1], [0, 'auto', 'nesw-resize']],
  ['nw', [1, 1, -1, -1], [0, 0, 'nwse-resize']],
  ['se', [0, 0, 1, 1], ['auto', 'auto', 'nwse-resize']],
  ['sw', [1, 0, -1, 1], ['auto', 0, 'nesw-resize']],
];

const edges: [string, ResizeDir, EdgeStyle][] = EDGES.map(([name, dir, [top, left, cursor]]) => {
  const isCorner = name.length === 2;
  const isVertical = name === 'n' || name === 's';
  const isHorizontal = name === 'e' || name === 'w';

  return [
    name,
    dir,
    {
      cursor,
      position: 'absolute',
      top: top === 'auto' ? 'auto' : typeof top === 'number' ? `${top * 100}%` : top,
      left: left === 'auto' ? 'auto' : typeof left === 'number' ? `${left * 100}%` : left,
      right: left === 'auto' ? '0' : undefined,
      bottom: top === 'auto' ? '0' : undefined,
      width: isCorner ? `${S}px` : isVertical ? `calc(100% - ${S * 2}px)` : `${S}px`,
      height: isCorner ? `${S}px` : isHorizontal ? `calc(100% - ${S * 2}px)` : `${S}px`,
      marginTop: isCorner || isVertical ? `-${S / 2}px` : undefined,
      marginLeft: isCorner || isHorizontal ? `-${S / 2}px` : undefined,
    } as EdgeStyle,
  ];
});

class WindowController {
  pos$ = new Flux({ x: 0, y: 0 });
  size$ = new Flux({ w: 400, h: 300 });
  min: [number, number] = [200, 150];
  max: [number, number] = [0, 0];
  draggable = false;
  resizable = false;

  private dragging = false;
  private resizeDir: ResizeDir | null = null;
  private startX = 0;
  private startY = 0;
  private startPos = { x: 0, y: 0 };
  private startSize = { w: 0, h: 0 };

  init(options: { w?: number; h?: number; min?: [number, number]; max?: [number, number]; draggable?: boolean; resizable?: boolean }) {
    if (options.w) this.size$.set({ ...this.size$.get(), w: options.w });
    if (options.h) this.size$.set({ ...this.size$.get(), h: options.h });
    if (options.min) this.min = options.min;
    if (options.max) this.max = options.max;
    if (options.draggable) this.draggable = options.draggable;
    if (options.resizable) this.resizable = options.resizable;
  }

  startDrag(e: MouseEvent) {
    if (!this.draggable) return;
    stopEvent(e);
    this.dragging = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.startPos = { ...this.pos$.get() };
    this.bindEvents();
  }

  startResize(e: MouseEvent, dir: ResizeDir) {
    if (!this.resizable) return;
    stopEvent(e);
    this.resizeDir = dir;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.startPos = { ...this.pos$.get() };
    this.startSize = { ...this.size$.get() };
    this.bindEvents();
  }

  private disposes: Unsubscribe[] = [];

  private bindEvents() {
    this.disposes.push(onHtmlEvent(0, 'mousemove', this.onMouseMove));
    this.disposes.push(onHtmlEvent(0, 'mouseup', this.onMouseUp));
  }

  private onMouseMove = (e: MouseEvent) => {
    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;

    if (this.dragging) {
      this.pos$.set({ x: this.startPos.x + dx, y: this.startPos.y + dy });
    } else if (this.resizeDir) {
      const [xDir, yDir, wDir, hDir] = this.resizeDir;

      const x = this.startPos.x + dx * xDir;
      const y = this.startPos.y + dy * yDir;
      const w = this.clampW(this.startSize.w + dx * wDir);
      const h = this.clampH(this.startSize.h + dy * hDir);

      this.pos$.set({ x, y });
      this.size$.set({ w, h });
    }
  };

  private onMouseUp = () => {
    this.dragging = false;
    this.resizeDir = null;
    for (const d of this.disposes) d();
    this.disposes = [];
  };

  private clampW(v: number) {
    v = Math.max(v, this.min[0]);
    if (this.max[0]) v = Math.min(v, this.max[0]);
    return v;
  }

  private clampH(v: number) {
    v = Math.max(v, this.min[1]);
    if (this.max[1]) v = Math.min(v, this.max[1]);
    return v;
  }
}

const c = Css('Window', {
  '': {
    position: 'fixed',
    inset: 0,
    bg: 'mask',
    center: 1,
    opacity: 0,
    transition: 0.3,
  },
  Box: {
    col: 1,
    position: 'relative',
    elevation: 4,
    rounded: 4,
    bg: 'bg',
    fg: 't',
    overflow: 'hidden',
    resize: 'both',
    scale: 0.9,
    opacity: 0,
    transition: 0.1,
  },
  Header: {
    row: ['center', 'between'],
    p: 2,
    bg: 'bg2',
  },
  '-draggable': {
    cursor: 'move',
  },
  Title: {
    bold: 1,
    fontSize: 1.2,
  },
  Content: {
    col: 1,
    flex: 1,
    overflow: 'auto',
    p: 2,
  },
  '-open': {
    opacity: 1,
  },
  '-open &Box': {
    scale: 1,
    opacity: 1,
  },
});

export interface WindowProps extends DivProps {
  open$: Flux<boolean>;
  ctrl?: WindowController;
  target?: HTMLElement;
  w?: number;
  h?: number;
  min?: [number, number];
  max?: [number, number];
  draggable?: boolean;
  resizable?: boolean;
}

const WindowRender = ({
  open$,
  ctrl: ctrlProp,
  target,
  title,
  children,
  w = 400,
  h = 300,
  min = [200, 150],
  max = [0, 0],
  draggable = false,
  resizable = false,
  ...props
}: WindowProps) => {
  const open = useFlux(open$);
  const ctrl = useMemo(() => {
    const c = ctrlProp ?? new WindowController();
    c.init({ w, h, min, max, draggable, resizable });
    if (target) {
      const rect = target.getBoundingClientRect();
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      c.pos$.set({
        x: rect.left + rect.width / 2 - centerX,
        y: rect.bottom - centerY + 10,
      });
    }
    return c;
  }, []);

  const pos = useFlux(ctrl.pos$);
  const size = useFlux(ctrl.size$);

  useEffect(() => {
    setTimeout(() => open$.set(true), 10);
  }, []);

  const boxStyle = {
    width: `${size.w}px`,
    height: `${size.h}px`,
    minWidth: `${min[0]}px`,
    minHeight: `${min[1]}px`,
    ...(max[0] && { maxWidth: `${max[0]}px` }),
    ...(max[1] && { maxHeight: `${max[1]}px` }),
    ...((draggable || resizable || target) && { transform: `translate(${pos.x}px, ${pos.y}px)` }),
  };

  return (
    <div {...c('', open && '-open')} onClick={() => open$.set(false)} {...props}>
      <div {...c('Box')} style={boxStyle} onClick={(e) => e.stopPropagation()}>
        <div {...c('Header', draggable && '-draggable')} onMouseDown={(e) => ctrl.startDrag(e)}>
          <div {...c('Title')}>{title}</div>
          <Button icon={X} onClick={() => open$.set(false)} />
        </div>
        <div {...c('Content')}>{open ? children : null}</div>
        {resizable &&
          edges.map(([name, dir, style]) => (
            <div key={name} style={style as any} onMouseDown={(e) => ctrl.startResize(e, dir)} />
          ))}
      </div>
    </div>
  );
};

export const showWindow = (title: string, content: Content, props?: Partial<WindowProps>) => {
  const open$ = new Flux(false);
  const ctrl = new WindowController();

  const dispose = portal(
    <WindowRender open$={open$} ctrl={ctrl} title={title} {...props}>
      {getContent(content)}
    </WindowRender>
  );

  open$.on((v) => !v && setTimeout(dispose, 300));

  return { ctrl, open$, close: () => open$.set(false) };
};
