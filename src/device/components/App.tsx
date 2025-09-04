import { Css, flexCenter, flexRow, setCss } from '@common/helpers';
import { useCss, useMsg } from '@common/hooks';
import { device$ } from '../services/device';
import { usePWA } from '../../serviceWorker';
import { Div, Side, SideButton, SideSep } from '@common/components';
import { JSX } from 'preact';
import { page$, PageName } from '../messages/page$';
import { LoadingPage } from '../pages/LoadingPage';
import { MdOutlineScreenshotMonitor, MdSettings, MdBugReport, MdEvent, MdPassword, MdFormatListBulleted, MdWeb, MdAccountCircle, MdBuild } from 'react-icons/md';
import { CodePinPage } from '../pages/CodePinPage';
import { SitePage } from '../pages/SitePage';
import { ConfigPlaylistPage } from '../pages/ConfigPlaylistPage';
import { TestPage } from '../pages/TestPage';
import { Corners } from './Corners';
import { KioskPage } from '../pages/KioskPage';
import { ActionsPage } from '../pages/ActionsPage';
import { EventsPage } from '../pages/EventsPage';
import { PlaylistPage } from '../pages/PlaylistPage';
import { PairingPage } from '../pages/PairingPage';
import { useEffect } from 'preact/hooks';
import { offlineMode$ } from '../messages';

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

const CompByPage: Record<PageName, () => JSX.Element> = {
  '': KioskPage,
  kiosk: KioskPage,
  actions: ActionsPage,
  site: SitePage,
  playlist: PlaylistPage,
  configPlaylist: ConfigPlaylistPage,
  wifi: LoadingPage,
  test: TestPage,
  // logs: LoadingPage,
  events: EventsPage,
  pairing: PairingPage,
  codePin: CodePinPage,
  logs: function (): JSX.Element {
    throw new Error('Function not implemented.');
  }
}

const AppRouter = () => {
  const page = useMsg(page$);
  const Page = CompByPage[page] || ActionsPage;
  return <Page />;
}

const AppContent = () => {
  const c = useCss('App', css);
  const page = useMsg(page$);
  const device = useMsg(device$);
  
  // Initialize PWA
  usePWA();

  useEffect(() => {
    if (!device?.group && !offlineMode$.v) {
      page$.set('pairing');
    }
  }, [device]);
  
  return (
    <Div cls={c}>
      {page !== 'kiosk' && page !== 'codePin' && page !== 'pairing' && (
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
    <AppContent />
  )
}