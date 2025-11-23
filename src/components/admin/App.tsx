import { Css } from 'fluxio';
import { JSX } from 'preact';
import { GroupsPage } from '@/components/admin/GroupsPage';
import { MembersPage } from '@/components/admin/MembersPage';
import { MediasPage } from '@/components/admin/MediasPage';
import { JobsPage } from '@/components/admin/JobsPage';
import { DevicesPage } from '@/components/admin/DevicesPage';
import { AuthPage } from '@/components/auth/AuthPage';
import { AccountPage } from '@/components/admin/AccountPage';
import { useEffect, useMemo } from 'preact/hooks';
import { Page } from '@/router/types';
import { useGroupKey, usePage } from '@/router/hooks';
import { Errors } from '@/components/admin/Errors';
import { useFlux } from '@/hooks/useFlux';
import { refreshTheme, updateTheme } from '@/utils/theme';
import { addFont } from '@/utils/addFont';
import { useApi, useGroup } from '@/hooks/apiHooks';
import { Api } from '@/api/Api';
import { getContent } from '@/components/common/getContent';
import { EditPlaylistPage } from '../pages/EditPlaylistPage';

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
  playlist: EditPlaylistPage,
  // contents: ContentsPage,
  // playlists: PlaylistsPage,
  // videos: VideosPage,
  // images: ImagesPage,
  // device: DevicePage,
  // content: ContentPage,
};

const AppRouter = () => {
  const page = usePage();
  return getContent(page ? (CompByPage[page] ?? GroupsPage) : GroupsPage);
};

const AppContent = () => {
  const api = useApi();
  const auth = useFlux(api.pb.auth$);

  // console.debug("AppContent", { c, auth });
  if (!auth) {
    return <AuthPage />;
  }

  // console.debug("Div", { c, auth });

  return (
    <div {...c()}>
      <AppRouter />
      <Errors />
    </div>
  );
};

export const AppSync = () => {
  const api = useApi();
  const groupKey = useGroupKey();
  const group = useGroup();
  const groupId = group?.id;
  const { isDark, primary, secondary } = group?.data || {};

  useEffect(() => {
    api.groupId$.set(groupId ?? '');
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
  
  return (
    <div id="app" {...c('')}>
      <AppSync />
      <AppContent />
    </div>
  );
};
