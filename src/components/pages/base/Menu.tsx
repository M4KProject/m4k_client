import { Css, Flux, isDefined } from 'fluxio';
import { useFlux } from '@/hooks/useFlux';
import { Button, ButtonProps } from '@/components/common/Button';
import { DivProps } from '@/components/common/types';
import { comp, Comp } from '@/utils/comp';
import { LayoutDashboardIcon } from 'lucide-react';
import { useRouteController } from '@/hooks/useRouteController';
import { useRoute } from '@/hooks/useRoute';
import { Page } from '@/controllers/RouteController';

export const MENU_MIN = 32;
export const MENU_OPEN = 180;

const c = Css('Menu', {
  '': {
    position: 'relative',
    transition: 0.2,
    elevation: 3,
    w: MENU_MIN,
    bg: 'bg',
    zIndex: 50,
  },

  Mask: {
    position: 'absolute',
    x: 0,
    y: '50%',
    w: MENU_MIN,
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
    wMin: MENU_OPEN,
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
    w: MENU_OPEN,
  },

  Sep: {
    flex: 1,
  },
});

export interface MenuButtonProps extends ButtonProps {
  tab?: boolean;
  page?: Page;
}

export const MenuButton = ({ tab, page, ...props }: MenuButtonProps) => {
  const routeController = useRouteController();
  const route = useRoute();
  console.debug('MenuButton', tab, page, route);
  return (
    <Button
      {...props}
      selected={page === route.page}
      {...c('Button', tab && 'Button-tab', props)}
      onClick={() => {
        routeController.go({ page });
      }}
    />
  )
};

export interface MenuProps extends DivProps {
  openMenu$: Flux<boolean>;
  menu?: Comp;
}

export const Menu = ({ openMenu$, menu, ...props }: MenuProps) => {
  const open = useFlux(openMenu$);
  return (
    <div {...props} {...c('', open ? '-open' : '-close', props)}>
      <div {...c('Mask')}>
        <div {...c('Content')}>
          {isDefined(menu) ? comp(menu) : (
            <>
              <MenuButton
                title="Tableau de bord"
                icon={LayoutDashboardIcon}
                page="dashboard"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
