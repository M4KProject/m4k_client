import { Css, flexCenter, flexRow } from '@common/helpers';
import { useCss } from '@common/hooks';
import { Div, Side, SideButton, SideSep } from '@common/components';
import { JSX, StrictMode } from 'react';
import { page$, usePage } from '@/messages/page$';
import { LoadingPage } from '@/pages/LoadingPage';
import { MdOutlineScreenshotMonitor, MdSettings, MdBugReport, MdDeveloperBoard, MdEvent, MdPassword, MdFormatListBulleted, MdWeb, MdAccountCircle, MdBuild } from 'react-icons/md';
import { PasswordPage } from '@/pages/PasswordPage';
import { SitePage } from '@/pages/SitePage';
import { ConfigPlaylistPage } from '@/pages/ConfigPlaylistPage';
import { TestPage } from '@/pages/TestPage';
import { DebugPage } from '@/pages/DebugPage';
import { Corners } from './Corners';
import { KioskPage } from '@/pages/KioskPage';
import { ActionsPage } from '@/pages/ActionsPage';
import { EventsPage } from '@/pages/EventsPage';
import { PlaylistPage } from '@/pages/PlaylistPage';

const css: Css = {
  '&': {
    ...flexRow({ align: 'stretch' }),
    position: 'fixed',
    overflow: 'hidden',
    inset: 0,
    bg: 'bg',
    fg: 'fg',
    fontFamily: 'Roboto',
  },
  '&-loading': {
    ...flexCenter(),
  },
  '& .Button': {
    fontSize: 1.4
  }
}

const CompByPage: Record<string, () => JSX.Element> = {
  kiosk: KioskPage,
  actions: ActionsPage,
  password: PasswordPage,
  site: SitePage,
  playlist: PlaylistPage,
  configPlaylist: ConfigPlaylistPage,
  wifi: LoadingPage,
  test: TestPage,
  debug: DebugPage,
  // logs: LoadingPage,
  events: EventsPage,
}

const AppRouter = () => {
  const page = usePage();
  const Page = CompByPage[page] || ActionsPage;
  return <Page />;
}


const AppContent = () => {
  const c = useCss('App', css);
  const page = usePage();
  return (
    <Div cls={c}>
      {page !== 'kiosk' && (
        <Side page$={page$}>
          <SideSep />
          <SideButton icon={<MdOutlineScreenshotMonitor />} page="kiosk" title="Kiosk" />
          <SideButton icon={<MdBuild />} page="actions" title="Actions" />
          <SideButton icon={<MdPassword />} page="password" title="Mot de passe" />
          <SideButton icon={<MdFormatListBulleted />} page="playlist" title="Playlist" />
          <SideButton icon={<MdSettings />} page="configPlaylist" title="Playlist Config" />
          <SideButton icon={<MdWeb />} page="site" title="Site Web" />
          {/* <SideButton icon={<MdWifi />} page="wifi" title="Wifi" /> */}
          <SideSep />
          <SideButton icon={<MdBugReport />} page="test" title="Test" />
          <SideButton icon={<MdDeveloperBoard />} page="debug" title="Debug" />
          {/* <SideButton icon={<MdListAlt />} page="logs" title="Logs" /> */}
          <SideButton icon={<MdEvent />} page="events" title="Events" />
          <SideSep />
          <SideButton icon={<MdAccountCircle />} page="account" title="Mon Compte" />
          {/* <SideSep style={{ fontSize: 0.7, opacity: 0.5 }}>2.0.0</SideSep> */}
        </Side>
      )}
      <Corners />
      <AppRouter />
    </Div>
  );
}

export const App = () => {
  return (
    <StrictMode>
      <AppContent />
    </StrictMode>
  )
}
