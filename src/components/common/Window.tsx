import { computeStyle, Css, stopEvent, Vector2, Vector4 } from 'fluxio';
import { useFlux } from '@/hooks/useFlux';
import { portal } from './Portal';
import { comp } from '@/utils/comp';
import { useMemo } from 'preact/hooks';
import { XIcon, CheckIcon, XCircleIcon, BanIcon } from 'lucide-react';
import { Button } from './Button';
import {
  useWindowController,
  WindowContext,
  WindowController,
  WindowFooterProps,
  WindowProps,
} from './WindowController';

const c = Css('Window', {
  '': {
    position: 'fixed',
    xy: 0,
    opacity: 0,
    transition: 0.3,
  },
  '-modal': {
    wh: '100%',
    bg: 'mask',
    opacity: 0,
    transition: 0.3,
  },
  Box: {
    col: 1,
    position: 'absolute',
    elevation: 4,
    rounded: 7,
    bg: 'bg',
    fg: 'fg',
    resize: 'both',
    scale: 0.9,
    opacity: 0,
    transition: 0.1,
    overflow: 'hidden',
  },
  Header: {
    row: ['center', 'between'],
    pl: 8,
    bg: 'header',
    fg: 'headerFg',
    cursor: 'move',
  },
  Close: {
    fg: 'headerFg',
  },
  Title: {
    bold: 1,
    fontSize: 1.2,
  },
  Content: {
    col: 1,
    flex: 1,
    overflow: 'auto',
    p: 8,
  },
  Footer: {
    row: ['center', 'end'],
    bg: 'bg2',
  },
  'Footer .Button': {
    flex: 1,
    m: 0,
    rounded: 0,
    row: ['center', 'center'],
    h: 36,
  },
  'Footer .ButtonContent': {
    flex: 0,
  },
  '-open': {
    opacity: 1,
  },
  '-open &Box': {
    scale: 1,
    opacity: 1,
  },
});

type EdgeStyle = {
  cursor: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  width?: string;
  height?: string;
};

const S = 8; // edge hit size
const H = 0.5;

// [name, [xDir, yDir, wDir, hDir], [top, left, cursor]]
type EdgeDir = Vector4<0 | 1 | -1>;
type EdgeXY = Vector2<number | string>;
const EDGES: [string, EdgeDir, EdgeXY, string][] = [
  ['n', [0, 1, 0, -1], [0, H], 'ns-resize'],
  ['s', [0, 0, 0, 1], ['auto', H], 'ns-resize'],
  ['e', [0, 0, 1, 0], [H, 'auto'], 'ew-resize'],
  ['w', [1, 0, -1, 0], [H, 0], 'ew-resize'],
  ['ne', [0, 1, 1, -1], [0, 'auto'], 'nesw-resize'],
  ['nw', [1, 1, -1, -1], [0, 0], 'nwse-resize'],
  ['se', [0, 0, 1, 1], ['auto', 'auto'], 'nwse-resize'],
  ['sw', [1, 0, -1, 1], ['auto', 0], 'nesw-resize'],
];

const edges: [string, Vector4, EdgeStyle][] = EDGES.map(([name, dir, [top, left], cursor]) => {
  const isCorner = name.length === 2;
  const isVertical = name === 'n' || name === 's';
  const isHorizontal = name === 'e' || name === 'w';

  return [
    name,
    dir,
    {
      cursor,
      position: 'absolute',
      top:
        top === 'auto' ? 'auto'
        : typeof top === 'number' ? `${top * 100}%`
        : top,
      left:
        left === 'auto' ? 'auto'
        : typeof left === 'number' ? `${left * 100}%`
        : left,
      right: left === 'auto' ? '0' : undefined,
      bottom: top === 'auto' ? '0' : undefined,
      width:
        isCorner ? `${S}px`
        : isVertical ? `calc(100% - ${S * 2}px)`
        : `${S}px`,
      height:
        isCorner ? `${S}px`
        : isHorizontal ? `calc(100% - ${S * 2}px)`
        : `${S}px`,
      marginTop: isCorner || isVertical ? `-${S / 2}px` : undefined,
      marginLeft: isCorner || isHorizontal ? `-${S / 2}px` : undefined,
    } as EdgeStyle,
  ];
});

export const WindowFooter = ({ yes, no, cancel }: WindowFooterProps) => {
  const controller = useWindowController();
  const hasButtons = yes || no || cancel;
  if (!hasButtons) return null;

  return (
    <div {...c('Footer')}>
      {yes && <Button color="success" icon={CheckIcon} title="Oui" onClick={controller.yes} />}
      {no && <Button color="warn" icon={XCircleIcon} title="Non" onClick={controller.no} />}
      {cancel && <Button color="error" icon={BanIcon} title="Annuler" onClick={controller.cancel} />}
    </div>
  );
};

const WindowRender = (props: WindowProps) => {
  const controller = useMemo(
    () => props.controller?.init(props) || new WindowController(props),
    [props.controller]
  );

  const { modal, draggable, resizable, title, content, children, yes, no, cancel } = props;

  const mounted = useFlux(controller.mounted$);
  const open = useFlux(controller.open$);
  const [x, y, w, h] = useFlux(controller.transform$);

  const boxStyle = computeStyle({ x, y, w, h });

  return (
    <WindowContext value={controller}>
      <div
        {...c('', modal && '-modal', open && '-open', mounted && '-mounted')}
        onClick={controller.close}
      >
        <div {...c('Box')} style={boxStyle as any} onClick={stopEvent}>
          <div {...c('Header', draggable && '-draggable')} onMouseDown={controller.drag}>
            {title && <div {...c('Title')}>{title}</div>}
            <Button {...c('Close')} icon={XIcon} onClick={controller.close} />
          </div>
          <div {...c('Content')}>
            {open ? comp(content) : null}
            {open ? children : null}
          </div>
          <WindowFooter yes={yes} no={no} cancel={cancel} />
          {resizable &&
            edges.map(([name, dir, style]) => (
              <div key={name} style={style as any} onMouseDown={controller.resize(dir)} />
            ))}
        </div>
      </div>
    </WindowContext>
  );
};

export const createWindow = (props: WindowProps) => {
  console.debug('createWindow', props);
  const controller = (props.controller || new WindowController(props)).init(props);
  controller.unmount = portal(<WindowRender {...props} controller={controller} />);
  return controller;
};
