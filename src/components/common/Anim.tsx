import { Css } from 'fluxio';
import { DivProps } from './types';
import { useAnimState } from '@/hooks/useAnimState';

const c = Css('Anim', {
  '-show': { opacity: 1 },
  '-showing': { opacity: 1 },
  '-hide': { opacity: 0 },
  '-hiding': { opacity: 0 },
});

export interface AnimProps extends DivProps {
    show: boolean;
    anim?: 'fade';
    duration?: number;
}

export const Anim = ({ show, anim, duration, ...props }: AnimProps) => {
    const state = useAnimState(show, duration || 300);
    return state === 'hide' ? null : (
        <div {...props} {...c('', `-${anim}`, `-${state}`, props)} />
    );
};
