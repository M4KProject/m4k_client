import { SideBar } from './SideBar';
import { Css } from 'fluxio';
import { JSX } from 'preact';
import { GroupsPage } from '../pages/GroupsPage';
import { MembersPage } from '../pages/MembersPage';
import { MediasPage } from '../pages/MediasPage';
import { JobsPage } from '../pages/JobsPage';
import { DevicesPage } from '../pages/DevicesPage';
import { AuthPage } from '../pages/AuthPage';
import { AccountPage } from '../pages/AccountPage';
import { useEffect, useMemo } from 'preact/hooks';
import { Page } from '@/router/types';
import { useGroupKey, usePage } from '@/router/hooks';
import { Errors } from './Errors';
import { getPbClient } from 'pblite';
import { useFlux } from '@/hooks/useFlux';
import { refreshTheme, updateTheme } from '@/utils/theme';
import { groupId$ } from '@/api/groupId$';
import { addFont } from '@/utils/addFont';
import { ApiContext, useGroup } from '@/hooks/apiHooks';
import { ApiCtrl } from '@/api/ApiCtrl';

const c = Css('App', {
  '': {
    row: 'stretch',
    position: 'fixed',
    overflow: 'auto',
    inset: 0,
    bg: 'bg',
    fg: 't',
    fontFamily: 'Roboto',
  },
  '-loading': {
    center: 1,
  },
});

const CompByPage: Record<Page, () => JSX.Element> = {
  '': GroupsPage,
  groups: GroupsPage,
  members: MembersPage,
  medias: MediasPage,
  jobs: JobsPage,
  devices: DevicesPage,
  account: AccountPage,
  // contents: ContentsPage,
  // playlists: PlaylistsPage,
  // videos: VideosPage,
  // images: ImagesPage,
  // device: DevicePage,
  // content: ContentPage,
};

const AppRouter = () => {
  const page = usePage();
  const Page = page ? (CompByPage[page] ?? GroupsPage) : GroupsPage;
  return <Page />;
};

const AppContent = () => {
  const auth = useFlux(getPbClient().auth$);

  // console.debug("AppContent", { c, auth });
  if (!auth) {
    return <AuthPage />;
  }

  // console.debug("Div", { c, auth });

  return (
    <div {...c()}>
      <SideBar />
      <AppRouter />
      <Errors />
    </div>
  );
};

export const AppSync = () => {
  const groupKey = useGroupKey();
  const group = useGroup();
  const groupId = group?.id;
  const { isDark, primary, secondary } = group?.data || {};

  useEffect(() => {
    getPbClient().authRefresh();
  }, []);

  useEffect(() => {
    groupId$.set(groupId ?? '');
  }, [groupId]);

  useEffect(() => {
    updateTheme({ isDark, primary, secondary });
  }, [isDark, primary, secondary]);

  console.debug('AppSync', { groupKey, group, groupId });

  return null;
};

export const App = () => {
  console.debug('App');

  useEffect(() => {
    addFont('Roboto');
    refreshTheme();
  }, []);

  const apiCtrl = useMemo(() => new ApiCtrl(), []);

  return (
    <ApiContext value={apiCtrl}>
      <div id="app" {...c('')}>
        <AppSync />
        <AppContent />
      </div>
    </ApiContext>
  );
};
