import { SideBar } from './SideBar';
import { Css, flexCenter, flexRow } from '@common/ui';
import { useCss, useMsg } from '@common/hooks';
import { Div } from '@common/components';
import { usePWA } from '../../serviceWorker';
import { JSX } from 'preact';
import { LoadingPage } from '../pages/LoadingPage';
import { GroupsPage } from '../pages/GroupsPage';
import { MembersPage } from '../pages/MembersPage';
import { ContentsPage } from '../pages/ContentsPage';
import { MediasPage } from '../pages/MediasPage';
import { JobsPage } from '../pages/JobsPage';
import { DevicesPage } from '../pages/DevicesPage';
import { AuthPage } from '../pages/AuthPage';
import { AccountPage } from '../pages/AccountPage';
import { ContentPage } from '../pages/ContentPage';
import { auth$ } from '@common/api/messages';
import { DevicePage } from '../pages/DevicePage';
import { AdminPage, useAdminPage } from '../messages/adminPage$';

const css: Css = {
  '&': {
    ...flexRow({ align: 'stretch' }),
    position: 'fixed',
    overflow: 'auto',
    inset: 0,
    bg: 'bg',
    fg: 'fg',
    fontFamily: 'Roboto',
  },
  '&-loading': {
    ...flexCenter(),
  },
  '& .Button': {
    fontSize: 1.4,
  },
};

const CompByPage: Record<AdminPage, () => JSX.Element> = {
  '': GroupsPage,
  groups: GroupsPage,
  members: MembersPage,
  contents: ContentsPage,
  medias: MediasPage,
  jobs: JobsPage,
  devices: DevicesPage,
  device: DevicePage,
  account: AccountPage,
  content: ContentPage,
};

const AppRouter = () => {
  const adminPage = useAdminPage();
  const Page = CompByPage[adminPage] || LoadingPage;
  return <Page />;
};

const AppContent = () => {
  const c = useCss('App', css);
  const auth = useMsg(auth$);

  // Initialize PWA
  usePWA();

  // console.debug("AppContent", { c, auth });
  if (!auth) {
    return <AuthPage />;
  }

  // console.debug("Div", { c, auth });

  return (
    <Div cls={c}>
      <SideBar />
      <AppRouter />
    </Div>
  );
};

export const App = () => {
  return <AppContent />;
};
