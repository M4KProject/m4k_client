import { Css, Flux, isDefined } from 'fluxio';
import { useFlux } from '@/hooks/useFlux';
import { Button, ButtonProps } from '@/components/common/Button';
import { DivProps } from '@/components/common/types';
import { comp, Comp } from '@/utils/comp';
import { MonitorIcon, FolderIcon, UsersIcon, HomeIcon } from 'lucide-react';
import { useRouter } from '@/hooks/useRoute';
import { useRoute } from '@/hooks/useRoute';
import { RoutePage } from '@/controllers/Router';

export const MENU_MIN = 32;
export const MENU_OPEN = 100;

const c = Css('Menu', {
  '': {
    position: 'relative',
    xy: 0,
    w: MENU_MIN,
    h: '100%',
    bg: 'bg',
    elevation: 2,
    transition: 0.3,
    zIndex: 50,
    col: ['start', 'around'],
    overflowX: 'hidden',
    overflowY: 'auto',
  },

  ' .Button': {
    m: 0,
    p: 0,
    wh: MENU_MIN,
    elevation: 1,
    rounded: 0,
    transition: 0.3,
    col: ['stretch', 'around'],
  },
  ' .ButtonIcon': {
    col: ['center', 'start'],
  },
  ' .ButtonIcon svg': {
    transition: 0.2,
    wh: 40,
  },
  ' .ButtonContent': {
    m: 0,
    b: 0,
    center: 1,
    textAlign: 'center',
    transition: 0.2,
    overflow: 'hidden',
    w: MENU_OPEN,
    h: 40,
    hMax: 40,
    opacity: 1,
    bold: 0,
  },

  '-close,-close .Button': {
    w: MENU_MIN,
  },
  '-close .ButtonIcon svg': {
    wh: 24,
  },
  '-close .ButtonContent': {
    h: 0,
    hMax: 0,
    opacity: 0,
  },

  '-open': {
    w: MENU_OPEN,
  },
  '-open .Button': {
    w: MENU_OPEN,
    h: 70,
  },

  Flex: {
    flex: 1,
  },
  Sep: {
    my: 4,
    h: 1,
    w: '100%',
    bg: 'border',
  },
});

export interface MenuButtonProps extends ButtonProps {
  page?: RoutePage;
}

export const MenuSep = () => <div {...c('Sep')} />;

export const MenuFlex = () => <div {...c('Flex')} />;

export const MenuButton = ({ page, ...props }: MenuButtonProps) => {
  const routeController = useRouter();
  const route = useRoute();
  const selected = props.selected || page === route.page;
  console.debug('MenuButton', { page, routePage: route.page, selected });
  return (
    <Button
      {...props}
      selected={selected}
      onClick={
        props.onClick ||
        (() => {
          routeController.go({ page });
        })
      }
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
          <MenuButton title="Accueil" icon={HomeIcon} page="dashboard" />
          <MenuButton title="Appareils" icon={MonitorIcon} page="devices" />
          <MenuButton title="Médias" icon={FolderIcon} page="medias" />
          <MenuButton title="Membres" icon={UsersIcon} page="members" />
        </>
      }
    </div>
  );
};
