import { onHtmlEvent, Unsubscribe } from 'fluxio';
import { Css } from 'fluxio';
import { DivProps } from './types';
import { comp, Comp } from '@/utils/comp';
import { portal } from './Portal';

const c = Css('Tooltip', {
  '': {
    position: 'absolute',
    userSelect: 'none',
    pointerEvents: 'none',
    zIndex: 9999,
  },
  Content: {
    center: 1,
    textAlign: 'center',
    position: 'absolute',
    wMin: 80,
    p: 8,
    fg: 'fg',
    bg: 'bg',
    rounded: 3,
    elevation: 2,
  },
  Arrow: {
    position: 'absolute',
    m: -4,
    w: 8,
    h: 8,
    fg: 'fg',
    bg: 'bg',
    rotate: '45deg',
  },

  '-top &Content': { t: -0.5, x: '50%', translate: '-50%, -100%' },
  '-top &Arrow': { t: -0.5, x: '50%' },

  '-bottom &Content': { b: -0.5, x: '50%', translate: '-50%, 100%' },
  '-bottom &Arrow': { b: -0.5, x: '50%' },
});

export interface TooltipProps extends Omit<DivProps, 'title'> {
  target: HTMLElement;
  children: Comp;
}
export const Tooltip = ({ target, children, ...props }: TooltipProps) => {
  const { top, left, width, height } = target.getBoundingClientRect();

  if (!children) return null;

  const pos: string = top > 200 ? 'top' : 'bottom';
  return (
    <div {...props} {...c('', `-${pos}`, props)} style={{ top, left, width, height }}>
      <div {...c('Arrow')} />
      <div {...c('Content')}>{comp(children)}</div>
    </div>
  );
};

const createTooltip = (eventOrTarget: Event | HTMLElement, content: Comp) => {
  const target =
    eventOrTarget instanceof Event ?
      ((eventOrTarget.currentTarget || eventOrTarget.target) as HTMLElement)
    : eventOrTarget;
  if (!(target instanceof HTMLElement)) return;

  const disposes: Unsubscribe[] = [];

  const dispose = () => {
    for (const d of disposes) d();
    disposes.length = 0;
  };

  const interval = setInterval(() => {
    if (!target.isConnected) {
      dispose();
    }
  }, 500);
  disposes.push(() => clearInterval(interval));

  disposes.push(onHtmlEvent(target, 'mouseleave', dispose));
  disposes.push(onHtmlEvent(0, 'click', dispose));

  disposes.push(portal(<Tooltip target={target}>{content}</Tooltip>));
};

export const tooltipProps = (content: Comp) => {
  return {
    onMouseOver: (event: Event) => {
      createTooltip(event, content);
    },
  };
};
