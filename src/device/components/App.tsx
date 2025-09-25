import { Css } from '@common/ui';
import { useMsg } from '@common/hooks';
import { device$ } from '../services/device';
import { usePWA } from '../../serviceWorker';
import { Side, SideButton, SideSep } from '@common/components';
import { JSX } from 'preact';
import { page$, PageName } from '../messages/page$';
import { LoadingPage } from '../pages/LoadingPage';
import { MonitorSpeaker, Settings, Bug, Calendar, List, Globe, Wrench } from 'lucide-react';
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

const c = Css('App', {
  '': {
    fRow: 'stretch',
    position: 'fixed',
    overflow: 'hidden',
    inset: 0,
    bg: 'b0',
    fg: 't2',
    fontFamily: 'Roboto',
  },
  '-loading': {
    fCenter: 1,
  },
});

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
  const page = useMsg(page$);
  const device = useMsg(device$);

  // Initialize PWA
  usePWA();

  useEffect(() => {
    if (!device?.group && !offlineMode$.v) {
      page$.set('pairing');
    }
  }, [device]);

  const go = (page: PageName) => () => page$.set(page);

  return (
    <div class={c()}>
      {page !== 'kiosk' && page !== 'codePin' && page !== 'pairing' && (
        <Side>
          <SideSep />
          <SideButton
            selected={page === ''}
            icon={<MonitorSpeaker />}
            title="Kiosk"
            onClick={go('kiosk')}
          />
          <SideButton
            selected={page === 'actions'}
            icon={<Wrench />}
            title="Actions"
            onClick={go('actions')}
          />
          {/* <SideButton icon={<KeyRound />} page="password" title="Mot de passe" /> */}
          <SideButton
            selected={page === 'playlist'}
            icon={<List />}
            title="Playlist"
            onClick={go('playlist')}
          />
          <SideButton
            selected={page === 'configPlaylist'}
            icon={<Settings />}
            title="Config"
            onClick={go('configPlaylist')}
          />
          <SideButton
            selected={page === 'site'}
            icon={<Globe />}
            title="Site Web"
            onClick={go('site')}
          />
          {/* <SideButton icon={<MdWifi />} page="wifi" title="Wifi" /> */}
          <SideSep />
          <SideButton selected={page === 'test'} icon={<Bug />} title="Test" onClick={go('test')} />
          {/* <SideButton icon={<MdListAlt />} page="logs" title="Logs" /> */}
          <SideButton
            selected={page === 'events'}
            icon={<Calendar />}
            title="Events"
            onClick={go('events')}
          />
          <SideSep />
          {/* <SideButton icon={<User />} page="account" title="Mon Compte" /> */}
          {/* <SideSep style={{ fontSize: 0.7, opacity: 0.5 }}>2.0.0</SideSep> */}
        </Side>
      )}
      <Corners />
      <AppRouter />
      <DialogContainer />
    </div>
  );
};

export const App = () => {
  return <AppContent />;
};
