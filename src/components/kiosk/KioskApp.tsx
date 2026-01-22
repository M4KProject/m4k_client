import { Css } from 'fluxio';
import { JSX } from 'preact';
import { LoadingPage } from '@/components/kiosk/LoadingPage';
import {
  MonitorSpeakerIcon,
  SettingsIcon,
  BugIcon,
  CalendarIcon,
  ListIcon,
  WrenchIcon,
} from 'lucide-react';
import { CodePinPage } from '@/components/kiosk/CodePinPage';
import { ConfigPlaylistPage } from '@/components/kiosk/ConfigPlaylistPage';
import { TestPage } from '@/components/kiosk/TestPage';
import { Corners } from './Corners';
import { ActionsPage } from '@/components/kiosk/ActionsPage';
import { EventsPage } from '@/components/kiosk/EventsPage';
import { PlaylistPage } from '@/components/kiosk/PlaylistPage';
import { PairingPage } from '@/components/kiosk/PairingPage';
import { useEffect } from 'preact/hooks';
import { useFlux } from '@/hooks/useFlux';
import { Page } from '../pages/base/Page';
import { MenuButton } from '../pages/base/Menu';
import { KioskView } from './KioskView';
import { getKProp, kInit, KioskPage, kPage$ } from '@/controllers/Kiosk';
import { api2 } from '@/api2';

const c = Css('DeviceApp', {
  '': {
    row: 'stretch',
    position: 'fixed',
    overflow: 'hidden',
    inset: 0,
    bg: 'bg',
    fg: 'fg',
    fontFamily: 'Roboto',
  },
  '-loading': {
    center: 1,
  },
});

const CompByPage: Record<KioskPage, () => JSX.Element> = {
  '': KioskView,
  kiosk: KioskView,
  actions: ActionsPage,
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

const KioskRouter = () => {
  const page = useFlux(kPage$);
  const Page = CompByPage[page] || ActionsPage;
  return <Page />;
};

const KioskMenu = () => {
  const page = useFlux(kPage$);
  const go = (page: KioskPage) => () => kPage$.set(page);

  return (
    <>
      <MenuButton
        selected={page === ''}
        icon={MonitorSpeakerIcon}
        title="Kiosk"
        onClick={go('kiosk')}
      />
      <MenuButton
        selected={page === 'actions'}
        icon={WrenchIcon}
        title="Actions"
        onClick={go('actions')}
      />
      {/* <SideButton icon={<KeyRound />} page="password" title="Mot de passe" /> */}
      <MenuButton
        selected={page === 'playlist'}
        icon={ListIcon}
        title="Playlist"
        onClick={go('playlist')}
      />
      <MenuButton
        selected={page === 'configPlaylist'}
        icon={SettingsIcon}
        title="Config"
        onClick={go('configPlaylist')}
      />
      {/* <SideButton icon={<MdWifi />} page="wifi" title="Wifi" /> */}
      <MenuButton selected={page === 'test'} icon={BugIcon} title="Test" onClick={go('test')} />
      {/* <SideButton icon={<MdListAlt />} page="logs" title="Logs" /> */}
      <MenuButton
        selected={page === 'events'}
        icon={CalendarIcon}
        title="Events"
        onClick={go('events')}
      />
      {/* <SideButton icon={<User />} page="account" title="Mon Compte" /> */}
      {/* <SideSep style={{ fontSize: 0.7, opacity: 0.5 }}>2.0.0</SideSep> */}
    </>
  );
};

const KioskContent = () => {
  useEffect(() => {
    kInit();
  }, []);

  const page = useFlux(kPage$);
  const device = useFlux(api2.devices.item$);

  useEffect(() => {
    if (!device?.groupId && !getKProp('offlineMode')) {
      kPage$.set('pairing');
    }
  }, [device]);

  if (page === 'kiosk' || page === 'codePin' || page === 'pairing') {
    return (
      <div {...c('')}>
        <Corners />
        <KioskRouter />
      </div>
    );
  }

  return (
    <Page menu={KioskMenu}>
      <Corners />
      <KioskRouter />
    </Page>
  );
};

export const KioskApp = () => {
  return <KioskContent />;
};
