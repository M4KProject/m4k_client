import { ComponentChildren } from 'preact';
import { render } from 'preact';
import { onEvent } from 'fluxio';
import { Css } from 'fluxio';
import { Tr } from './Tr';
import { addOverlay, removeOverlay } from 'fluxio';
import { DivProps } from './types';

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
    fg: 't',
    bg: 'bg',
    rounded: 3,
    fontFamily: 'Roboto',
    elevation: 2,
  },
  Arrow: {
    position: 'absolute',
    m: -4,
    w: 8,
    h: 8,
    fg: 't',
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
  children: ComponentChildren;
}
export const Tooltip = ({ target, children, ...props }: TooltipProps) => {
  const { top, left, width, height } = target.getBoundingClientRect();

  console.debug('top', top);

  if (!children) return null;

  const pos: string = top > 40 ? 'top' : 'bottom';
  return (
    <div {...props} {...c('', `-${pos}`, props)} style={{ top, left, width, height }}>
      <div {...c('Arrow')} />
      <div {...c('Content')}>
        <Tr>{children}</Tr>
      </div>
    </div>
  );
};
// , pos?: 'top'|'bottom'|'left'|'right'

export const getTooltipProps = (content: undefined | ComponentChildren | (() => ComponentChildren)) => {
  if (!content) return {};
  let intervalRef: any;
  let overlay: HTMLDivElement | null = null;
  let root: any = null;
  let removeLeaveListener: (() => void) | null = null;
  let removeClickListener: (() => void) | null = null;
  const remove = async () => {
    clearInterval(intervalRef);
    if (removeLeaveListener) {
      removeLeaveListener();
      removeLeaveListener = null;
    }
    if (removeClickListener) {
      removeClickListener();
      removeClickListener = null;
    }
    if (overlay) {
      await removeOverlay(overlay);
      overlay = null;
    }
    if (root) {
      root.unmount();
      root = null;
    }
  };
  return {
    onMouseOver: (event: any) => {
      const target = (event.currentTarget || event.target) as HTMLElement;

      clearInterval(intervalRef);
      intervalRef = setInterval(() => {
        if (!target.isConnected) remove();
      }, 500);

      if (removeLeaveListener) removeLeaveListener();
      removeLeaveListener = onEvent(target, 'mouseleave', remove);

      if (removeClickListener) removeClickListener();
      removeClickListener = onEvent(0, 'click', remove);

      if (!overlay) overlay = addOverlay();

      render(
        <Tooltip target={target}>{typeof content === 'function' ? content() : content}</Tooltip>,
        overlay
      );
    },
  };
};
