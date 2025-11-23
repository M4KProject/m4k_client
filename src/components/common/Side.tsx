import { Css, flux } from 'fluxio';
import { DivProps } from './types';
import { Button, ButtonProps } from './Button';
import { Menu } from 'lucide-react';
import { useFlux } from '@/hooks/useFlux';

export const SIDE_MIN = 40;
export const SIDE_OPEN = 180;

const c = Css('Side', {
  '': {
    position: 'relative',
    transition: 0.2,
    elevation: 3,
    w: SIDE_MIN,
    bg: 'bg',
    zIndex: 50,
  },
  Mask: {
    position: 'absolute',
    x: 0,
    y: '50%',
    w: SIDE_MIN,
    h: '100%',
    zIndex: 100,
    overflow: 'hidden',
    translateY: '-50%',
    transition: 0.2,
  },
  Content: {
    col: 1,
    position: 'absolute',
    xy: 0,
    wMin: SIDE_OPEN,
    h: '100%',
  },
  Button: {
    elevation: 1,
    my: 4,
  },

  ' .ButtonContent': {
    transition: 0.2,
    opacity: 1,
  },
  '-close .ButtonContent': {
    opacity: 0,
  },
  ' &Button-tab': {
    ml: 24,
    transition: 0.2,
  },
  '-close .Button': {
    ml: 2,
  },

  '-open, -open &Mask': {
    w: SIDE_OPEN,
  },

  Sep: {
    flex: 1,
  },
});

export interface SideButtonProps extends ButtonProps {
  tab?: boolean;
}
export const SideButton = ({ tab, ...props }: SideButtonProps) => (
  <Button {...props} {...c('Button', tab && 'Button-tab', props)} />
);

export const SideSep = (props: DivProps) => <div {...props} {...c('Sep', props)} />;

export const sideOpen$ = flux(true);

export const Side = ({ children, ...props }: DivProps) => {
  const open = useFlux(sideOpen$);
  const toggleOpen = () => sideOpen$.set((open) => !open);
  return (
    <div {...props} {...c('', open ? '-open' : '-close', props)}>
      <div {...c('Mask')}>
        <div {...c('Content')}>
          <Button icon={Menu} onClick={toggleOpen}>
            Ouvrir
          </Button>
          {children}
        </div>
      </div>
    </div>
  );
};
