import {
  Flux,
  onHtmlEvent,
  Unsubscribe,
  stopEvent,
  Vector2,
  Vector4,
  VECTOR2_ZERO,
  getEventXY,
  clamp,
  VECTOR4_ZERO,
  mustExist,
  SizeWH,
  Transform,
  PosXY,
  clampVector,
  VECTOR4_MAX,
  toVoid,
} from 'fluxio';
import { useContext } from 'preact/hooks';
import { ComponentChildren, createContext } from 'preact';
import { Comp } from '@/utils/comp';

export interface WindowFooterProps {
  yes?: (controller: WindowController) => void;
  no?: (controller: WindowController) => void;
  cancel?: (controller: WindowController) => void;
}

export interface WindowProps extends WindowFooterProps {
  modal?: boolean;
  title?: string;
  content?: Comp;
  children?: ComponentChildren;
  controller?: WindowController;
  target?: HTMLElement;
  pos?: PosXY;
  size?: SizeWH;
  min?: SizeWH | Transform;
  max?: SizeWH | Transform;
  draggable?: boolean;
  resizable?: boolean;
}

export class WindowController {
  props: WindowProps = {};

  open$ = new Flux(false);
  mounted$ = new Flux(false);

  transform$ = new Flux<Transform>(VECTOR4_ZERO);
  min: Transform = VECTOR4_ZERO;
  max: Transform = VECTOR4_ZERO;

  draggable = false;
  resizable = false;
  response$ = new Flux('');

  readonly offs: Unsubscribe[] = [];
  unmount: Unsubscribe = toVoid;

  private dragging = false;
  private resizeDir: Vector4 | null = null;
  private start = {
    event: null as Event | null,
    eventXY: VECTOR2_ZERO,
    transform: VECTOR4_ZERO,
  };

  constructor(props: WindowProps) {
    console.debug('WindowController constructor', props);
    this.init(props);
  }

  init(props: WindowProps) {
    console.debug('WindowController init', props);

    if (this.props === props) return this;
    this.props = props;

    const { target, pos, size, min, max, draggable, resizable } = props;

    let transform = VECTOR4_ZERO;

    // Get window size (use provided size or default to auto)
    const w = size?.[0] || 0;
    const h = size?.[1] || 0;

    let x: number;
    let y: number;

    if (target instanceof HTMLElement) {
      // Center window on target position
      const rect = target.getBoundingClientRect();
      const targetCenterX = rect.left + rect.width / 2;
      const targetCenterY = rect.top + rect.height / 2;
      x = targetCenterX - w / 2;
      y = targetCenterY - h / 2;
    } else {
      // Center window on screen (for modals without target)
      x = (window.innerWidth - w) / 2;
      y = (window.innerHeight - h) / 2;
    }

    transform = [x, y, w, h];

    // Set min/max constraints
    const minX = 0;
    const minY = 0;
    const maxX = w > 0 ? window.innerWidth - w : window.innerWidth;
    const maxY = h > 0 ? window.innerHeight - h : window.innerHeight;

    this.min =
      min ?
        min.length === 2 ?
          [minX, minY, min[0], min[1]]
        : min
      : [minX, minY, 0, 0];
    this.max =
      max ?
        max.length === 2 ?
          [maxX, maxY, max[0], max[1]]
        : max
      : [maxX, maxY, VECTOR4_MAX[2], VECTOR4_MAX[3]];

    console.debug('WindowController transform', transform, this.min, this.max);

    // Clamp position to keep window on screen
    transform = clampVector(transform, this.min, this.max);
    this.transform$.set(transform);

    this.draggable = draggable !== undefined ? draggable : true;
    this.resizable = resizable || false;

    setTimeout(this.open, 10);

    return this;
  }

  private startDrag(event: Event) {
    if (!this.draggable) return;
    stopEvent(event);
    this.dragging = true;
    const eventXY = mustExist(getEventXY(event), 'startDrag eventXY');
    const transform = this.transform$.get();
    this.start = { event, eventXY, transform };
    this.bindEvents();
  }

  private startResize(event: Event, dir: Vector4) {
    if (!this.resizable) return;
    stopEvent(event);
    this.dragging = false;
    this.resizeDir = dir;
    const eventXY = mustExist(getEventXY(event), 'startResize eventXY');
    const transform = this.transform$.get();
    this.start = { event, eventXY, transform };
    this.bindEvents();
  }

  private bindEvents() {
    this.offs.push(onHtmlEvent(0, 'mousemove', this.onMove), onHtmlEvent(0, 'mouseup', this.onUp));
  }

  private onMove = (event: Event) => {
    const {
      eventXY: [startEventX, startEventY],
      transform: [startX, startY, startW, startH],
    } = this.start;
    const eventXY = mustExist(getEventXY(event), 'onMouseMove eventXY');
    const [eventX, eventY] = eventXY;
    const dx = eventX - startEventX;
    const dy = eventY - startEventY;

    if (this.dragging) {
      this.transform$.set([startX + dx, startY + dy, startW, startH]);
    } else if (this.resizeDir) {
      const [xDir, yDir, wDir, hDir] = this.resizeDir;

      const x = startX + dx * xDir;
      const y = startY + dy * yDir;
      const w = clamp(startW + dx * wDir, this.min[0], this.max[0] || Number.MAX_VALUE);
      const h = clamp(startH + dy * hDir, this.min[1], this.max[1] || Number.MAX_VALUE);

      this.transform$.set([x, y, w, h]);
    }
  };

  private onUp = () => {
    this.dragging = false;
    this.resizeDir = null;
    for (const off of this.offs) off();
    this.offs.length = 0;
  };

  open = () => {
    this.mounted$.set(true);
    setTimeout(() => {
      if (this.mounted$.get() === true) {
        this.open$.set(true);
      }
    }, 10);
  };

  close = () => {
    console.debug('WindowController close');
    if (!this.response$.get()) {
      this.cancel();
      return;
    }
    this.open$.set(false);
    setTimeout(() => {
      console.debug('WindowController close end');
      if (this.open$.get() === false) {
        console.debug('WindowController close unmount');
        this.onUp();
        this.unmount();
      }
    }, 500);
  };

  setResponse(response: string) {
    console.debug('WindowController setResponse', response);
    if (this.response$.get()) return;
    this.response$.set(response);
    this.close();
    if (response === 'yes') this.props.yes?.(this);
    else if (response === 'no') this.props.no?.(this);
    else if (response === 'cancel') this.props.cancel?.(this);
  }

  yes = () => this.setResponse('yes');
  no = () => this.setResponse('no');
  cancel = () => this.setResponse('cancel');

  drag = (e: Event) => this.startDrag(e);

  resize(dir: Vector4) {
    return (e: Event) => this.startResize(e, dir);
  }
}

export const WindowContext = createContext<WindowController | null>(null);
export const useWindowController = () => useContext(WindowContext)!;
