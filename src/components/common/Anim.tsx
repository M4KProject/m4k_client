import { Css } from 'fluxio';
import { DivProps } from './types';
import { AnimState, useAnimState } from '@/hooks/useAnimState';
import { ComponentChildren } from 'preact';

const c = Css('Anim', {
  '': { transition: 0.3 },

  '-fade&-entering': { opacity: 0 },
  '-fade&-entered': { opacity: 1 },
  '-fade&-exiting': { opacity: 0 },

  '-scale&-entering': { opacity: 0, scale: 0.8 },
  '-scale&-entered': { opacity: 1, scale: 1 },
  '-scale&-exiting': { opacity: 0, scale: 0.8 },

  '-slide&-entering': { opacity: 0, translateX: '-100%' },
  '-slide&-entered': { opacity: 1, translateX: 0 },
  '-slide&-exiting': { opacity: 0, translateX: '100%' },
});

export interface AnimProps extends DivProps {
    show: boolean;
    variant?: 'fade' | 'scale' | 'slide';
    keepMounted?: boolean;
    factory?: (state: AnimState) => ComponentChildren;
}

export const Anim = ({ show, variant, keepMounted, factory, children, ...props }: AnimProps) => {
    const state = useAnimState(show, 400);

    if (!keepMounted && state === 'unmounted') return null;

    return (
        <div {...props} {...c('', `-${variant||'fade'}`, `-${state}`, props)}>
            {factory && factory(state)}
            {children}
        </div>
    );
};
