import { Css, flexCenter, flexRow } from '@common/helpers';
import { useCss, useMsg } from '@common/hooks';
import { device$ } from '../services/device';
import { usePWA } from '../../serviceWorker';
import { Div, Side, SideButton, SideSep } from '@common/components';
import { JSX } from 'preact';
import { page$, PageName } from '../messages/page$';
import { LoadingPage } from '../pages/LoadingPage';
import {
  MonitorSpeaker,
  Settings,
  Bug,
  Calendar,
  List,
  Globe,
  Wrench,
} from 'lucide-react';
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
import { DialogContainer } from './DialogContainer';

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
    fontSize: 1.4,
  },
};

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
  },
};

const AppRouter = () => {
  const page = useMsg(page$);
  const Page = CompByPage[page] || ActionsPage;
  return <Page />;
};

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
          <SideButton icon={<MonitorSpeaker />} page="kiosk" title="Kiosk" />
          <SideButton icon={<Wrench />} page="actions" title="Actions" />
          {/* <SideButton icon={<KeyRound />} page="password" title="Mot de passe" /> */}
          <SideButton icon={<List />} page="playlist" title="Playlist" />
          <SideButton icon={<Settings />} page="configPlaylist" title="Config" />
          <SideButton icon={<Globe />} page="site" title="Site Web" />
          {/* <SideButton icon={<MdWifi />} page="wifi" title="Wifi" /> */}
          <SideSep />
          <SideButton icon={<Bug />} page="test" title="Test" />
          {/* <SideButton icon={<MdListAlt />} page="logs" title="Logs" /> */}
          <SideButton icon={<Calendar />} page="events" title="Events" />
          <SideSep />
          {/* <SideButton icon={<User />} page="account" title="Mon Compte" /> */}
          {/* <SideSep style={{ fontSize: 0.7, opacity: 0.5 }}>2.0.0</SideSep> */}
        </Side>
      )}
      <Corners />
      <AppRouter />
      <DialogContainer />
    </Div>
  );
};

export const App = () => {
  return <AppContent />;
};
