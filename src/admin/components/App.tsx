import { SideBar } from './SideBar';
import { Css } from '@common/ui';
import { useMsg } from '@common/hooks';
import { usePWA } from '../../serviceWorker';
import { JSX } from 'preact';
import { LoadingPage } from '../pages/LoadingPage';
import { GroupsPage } from '../pages/GroupsPage';
import { MembersPage } from '../pages/MembersPage';
import { ContentsPage } from '../../../tmp/ContentsPage';
import { MediasPage } from '../pages/MediasPage';
import { JobsPage } from '../pages/JobsPage';
import { DevicesPage } from '../pages/DevicesPage';
import { AuthPage } from '../pages/AuthPage';
import { AccountPage } from '../pages/AccountPage';
import { ContentPage } from '../../../tmp/ContentPage';
import { auth$ } from '@common/api';
import { DevicePage } from '../pages/DevicePage';
import { PlaylistsPage } from '../pages/PlaylistsPage';
import { ImagesPage } from '../pages/ImagesPage';
import { VideosPage } from '../pages/VideosPage';
import { Page, usePage } from '../controllers/router';

const c = Css('App', {
  '': {
    fRow: 'stretch',
    position: 'fixed',
    overflow: 'auto',
    inset: 0,
    bg: 'b2',
    fg: 't2',
    fontFamily: 'Roboto',
  },
  '-loading': {
    fCenter: 1,
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
  const Page = CompByPage[page] || GroupsPage;
  return <Page />;
};

const AppContent = () => {
  const auth = useMsg(auth$);

  // Initialize PWA
  usePWA();

  // console.debug("AppContent", { c, auth });
  if (!auth) {
    return <AuthPage />;
  }

  // console.debug("Div", { c, auth });

  return (
    <div class={c()}>
      <SideBar />
      <AppRouter />
    </div>
  );
};

export const App = () => {
  return <AppContent />;
};
