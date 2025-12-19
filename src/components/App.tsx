import { Css } from 'fluxio';
import { useEffect } from 'preact/hooks';
import { Errors } from '@/components/admin/Errors';
import { refreshTheme } from '@/utils/theme';
import { addFont } from '@/utils/addFont';
import { EditPage } from '@/components/pages/EditPage';
import { useIsKiosk, useRoute } from '@/hooks/useRoute';
import { Comp, comp } from '@/utils/comp';
import { DashboardPage } from '@/components/pages/DashboardPage';
import { MembersPage } from '@/components/pages/MembersPage';
import { MediasPage } from '@/components/pages/MediasPage';
import { DevicesPage } from '@/components/pages/DevicesPage';
import { KioskPage } from '@/components/pages/KioskPage';
import { AuthPage } from '@/components/pages/AuthPage';
import { useAuth } from '@/hooks/useApi';
import { RoutePage } from '@/controllers/Router';

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
  const { page } = useRoute();
  return comp(CompByPage[page || 'dashboard'] || DashboardPage);
};

const AppContent = () => {
  const auth = useAuth();
  const isKiosk = useIsKiosk();

  console.debug('AppContent', { c, auth, isKiosk });

  if (isKiosk) {
    return (
      <div {...c('')}>
        <KioskPage />
      </div>
    );
  }

  if (!auth) {
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

// export const AppSync = () => {
//   const api = useApi();
//   const { group: groupKey } = useRoute();
//   const group = useFlux(groupKey ? api.group.find$({ key: groupKey }) : undefined);
//   const groupId = group?.id;
//   const { isDark, primary, secondary } = group?.data || {};

//   useEffect(() => {
//     api.groupId$.set(groupId ?? '');
//   }, [groupId]);

//   useEffect(() => {
//     updateTheme({ isDark, primary, secondary });
//   }, [isDark, primary, secondary]);

//   console.debug('AppSync', { groupKey, group, groupId });

//   return null;
// };

export const App = () => {
  console.debug('App');

  useEffect(() => {
    addFont('Roboto');
    refreshTheme();
  }, []);

  return (
    <div id="app" {...c('')}>
      {/* <AppSync /> */}
      <AppContent />
    </div>
  );
};
