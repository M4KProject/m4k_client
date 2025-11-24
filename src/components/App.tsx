import { Css } from 'fluxio';
import { useEffect } from 'preact/hooks';
import { Errors } from '@/components/admin/Errors';
import { refreshTheme } from '@/utils/theme';
import { addFont } from '@/utils/addFont';
import { EditPage } from '@/components/pages/EditPage';
import { useRoute, Page } from '@/hooks/useRoute';
import { Comp, comp } from '@/utils/comp';
import { DashboardPage } from './pages/DashboardPage';

const c = Css('App', {
  '': {
    row: 'stretch',
    position: 'fixed',
    overflow: 'auto',
    inset: 0,
    bg: 'bg',
    fg: 't',
    fontFamily: 'Roboto',
    fontSize: '18px',
  },
  '-loading': {
    center: 1,
  },
});

const CompByPage: Partial<Record<Page, Comp>> = {
  dashboard: DashboardPage,
  // groups: GroupsPage,
  // members: MembersPage,
  // medias: MediasPage,
  // jobs: JobsPage,
  // devices: DevicesPage,
  // account: AccountPage,
  edit: EditPage,
};

const AppRouter = () => {
  const { page } = useRoute();
  return comp(CompByPage[page||'dashboard'] || DashboardPage);
};

const AppContent = () => {
  // const api = useApi();

  // const auth = useFlux(api.pb.auth$);

  // // console.debug("AppContent", { c, auth });
  // if (!auth) {
  //   return <AuthPage />;
  // }

  // console.debug("Div", { c, auth });

  return (
    <div {...c()}>
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
