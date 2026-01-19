import { Css } from 'fluxio';
import { useEffect } from 'preact/hooks';
import { Errors } from '@/components/admin/Errors';
import { refreshTheme } from '@/utils/theme';
import { addFont } from '@/utils/addFont';
import { EditPage } from '@/components/pages/EditPage';
import { useIsKiosk, usePage } from '@/hooks/useRoute';
import { Comp, comp } from '@/utils/comp';
import { DashboardPage } from '@/components/pages/DashboardPage';
import { MembersPage } from '@/components/pages/MembersPage';
import { MediasPage } from '@/components/pages/MediasPage';
import { DevicesPage } from '@/components/pages/DevicesPage';
import { KioskPage } from '@/components/pages/KioskPage';
import { AuthPage } from '@/components/pages/AuthPage';
import { RoutePage } from '@/controllers/Router';
import { useFlux } from '@/hooks/useFlux';
import { api2 } from '@/api2';

const c = Css('App', {
  '': {
    wh: '100%',
    row: 'stretch',
    position: 'fixed',
    overflow: 'auto',
    inset: 0,
    bg: 'bg',
    fg: 'fg',
    fontFamily: 'Roboto',
    fontSize: '18px',
  },
  '-loading': {
    center: 1,
  },
});

const CompByPage: Partial<Record<RoutePage, Comp>> = {
  dashboard: DashboardPage,
  members: MembersPage,
  medias: MediasPage,
  devices: DevicesPage,
  edit: EditPage,
};

const AppRouter = () => {
  const page = usePage();
  return comp(CompByPage[page || 'dashboard'] || DashboardPage);
};

const AppContent = () => {
  const isAuth = useFlux(api2.client.isAuth$);
  const isKiosk = useIsKiosk();

  console.debug('AppContent', { c, isAuth, isKiosk });

  if (isKiosk) {
    return (
      <div {...c('')}>
        <KioskPage />
      </div>
    );
  }

  if (!isAuth) {
    return (
      <div {...c('')}>
        <AuthPage />
      </div>
    );
  }

  return (
    <div {...c('')}>
      <AppRouter />
      <Errors />
    </div>
  );
};

export const App = () => {
  console.debug('App');

  useEffect(() => {
    addFont('Roboto');
    refreshTheme();
  }, []);

  return (
    <div id="app" {...c('')}>
      <AppContent />
    </div>
  );
};
