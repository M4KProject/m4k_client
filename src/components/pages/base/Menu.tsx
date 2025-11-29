import { Css, Flux, isDefined } from 'fluxio';
import { useFlux } from '@/hooks/useFlux';
import { Button, ButtonProps } from '@/components/common/Button';
import { DivProps } from '@/components/common/types';
import { comp, Comp } from '@/utils/comp';
import {
  LayoutDashboardIcon,
  MonitorIcon,
  FolderIcon,
  UsersIcon,
} from 'lucide-react';
import { useRouter } from '@/hooks/useRoute';
import { useRoute } from '@/hooks/useRoute';
import { RoutePage } from '@/controllers/Router';

export const MENU_MIN = 32;
export const MENU_OPEN = 150;

const c = Css('Menu', {
  '': {
    position: 'relative',
    xy: 0,
    w: MENU_MIN,
    h: '100%',
    bg: 'bg',
    elevation: 2,
    transition: 0.2,
    zIndex: 50,
    col: 1,
  },

  ' .Button': {
    m: 0,
    p: 0,
    wh: MENU_MIN,
    elevation: 1,
    rounded: 0,
  },
  ' .ButtonIcon': {
    position: 'absolute',
    xy: 4,
    m: 0,
    p: 0,
    center: 1,
  },

  ' .ButtonContent': {
    position: 'absolute',
    w: MENU_OPEN,
    b: 0,
    center: 1,
    textAlign: 'center',
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

  '-open': {
    w: MENU_OPEN,
  },
  '-open .Button': {
    m: 0,
    p: 0,
    w: MENU_OPEN,
    h: 70,
    elevation: 1,
    rounded: 0,
  },
  '-open .ButtonIcon': {
    w: MENU_OPEN,
    col: 1,
  },

  Sep: {
    flex: 1,
  },
});

export interface MenuButtonProps extends ButtonProps {
  tab?: boolean;
  page?: RoutePage;
}

export const MenuSep = () => (
  <div {...c('Sep')} />
);

      // {...c('Button', tab && 'Button-tab', props)}

export const MenuButton = ({ tab, page, ...props }: MenuButtonProps) => {
  const routeController = useRouter();
  const route = useRoute();
  const selected = props.selected || page === route.page;
  console.debug('MenuButton', { tab, page, routePage: route.page, selected });
  return (
    <Button
      {...props}
      selected={selected}
      onClick={props.onClick || (() => {
        routeController.go({ page });
      })}
    />
  );
};

export interface MenuProps extends DivProps {
  openMenu$: Flux<boolean>;
  menu?: Comp;
}

export const Menu = ({ openMenu$, menu, ...props }: MenuProps) => {
  const open = useFlux(openMenu$);
  return (
    <div {...props} {...c('', open ? '-open' : '-close', props)}>
      {isDefined(menu) ?
        comp(menu)
      : <>
          <MenuSep />
          <MenuButton title="Tableau de bord" icon={LayoutDashboardIcon} page="dashboard" />
          <MenuSep />
          <MenuButton title="Appareils" icon={MonitorIcon} page="devices" />
          <MenuButton title="Bibliothèque" icon={FolderIcon} page="medias" />
          <MenuButton title="Membres" icon={UsersIcon} page="members" />
          {/* <MenuButton title="Jobs" icon={ZapIcon} page="jobs" /> */}
          <MenuSep />
          {/* <MenuButton title="Mon compte" icon={UserIcon} page="account" />
          <MenuSep /> */}
        </>
      }
    </div>
  );
};
