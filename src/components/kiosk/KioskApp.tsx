import { Css } from 'fluxio';
import { JSX } from 'preact';
import { LoadingPage } from '@/components/kiosk/LoadingPage';
import { MonitorSpeaker, Settings, Bug, Calendar, List, Wrench } from 'lucide-react';
import { CodePinPage } from '@/components/kiosk/CodePinPage';
import { ConfigPlaylistPage } from '@/components/kiosk/ConfigPlaylistPage';
import { TestPage } from '@/components/kiosk/TestPage';
import { Corners } from './Corners';
import { ActionsPage } from '@/components/kiosk/ActionsPage';
import { EventsPage } from '@/components/kiosk/EventsPage';
import { PlaylistPage } from '@/components/kiosk/PlaylistPage';
import { PairingPage } from '@/components/kiosk/PairingPage';
import { useEffect } from 'preact/hooks';
import { DialogContainer } from './DialogContainer';
import { useFlux } from '@/hooks/useFlux';
import { useKiosk } from '@/hooks/useKiosk';
import { Page } from '../pages/base/Page';
import { MenuButton } from '../pages/base/Menu';
import { KioskView } from './KioskView';
import { KioskPage } from '@/controllers/Kiosk';

const c = Css('DeviceApp', {
  '': {
    row: 'stretch',
    position: 'fixed',
    overflow: 'hidden',
    inset: 0,
    bg: 'bg',
    fg: 'txt',
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
  const kiosk = useKiosk();
  const page = useFlux(kiosk.page$);
  const Page = CompByPage[page] || ActionsPage;
  return <Page />;
};

const KioskMenu = () => {
  const kiosk = useKiosk();
  const page = useFlux(kiosk.page$);
  const go = (page: KioskPage) => () => kiosk.page$.set(page);

  return (
    <>
      <MenuButton
        selected={page === ''}
        icon={MonitorSpeaker}
        title="Kiosk"
        onClick={go('kiosk')}
      />
      <MenuButton
        selected={page === 'actions'}
        icon={Wrench}
        title="Actions"
        onClick={go('actions')}
      />
      {/* <SideButton icon={<KeyRound />} page="password" title="Mot de passe" /> */}
      <MenuButton
        selected={page === 'playlist'}
        icon={List}
        title="Playlist"
        onClick={go('playlist')}
      />
      <MenuButton
        selected={page === 'configPlaylist'}
        icon={Settings}
        title="Config"
        onClick={go('configPlaylist')}
      />
      {/* <SideButton icon={<MdWifi />} page="wifi" title="Wifi" /> */}
      <MenuButton selected={page === 'test'} icon={Bug} title="Test" onClick={go('test')} />
      {/* <SideButton icon={<MdListAlt />} page="logs" title="Logs" /> */}
      <MenuButton
        selected={page === 'events'}
        icon={Calendar}
        title="Events"
        onClick={go('events')}
      />
      {/* <SideButton icon={<User />} page="account" title="Mon Compte" /> */}
      {/* <SideSep style={{ fontSize: 0.7, opacity: 0.5 }}>2.0.0</SideSep> */}
    </>
  );
};

const KioskContent = () => {
  const kiosk = useKiosk();

  useEffect(() => {
    kiosk.init();
  }, []);

  const page = useFlux(kiosk.page$);
  const device = useFlux(kiosk.device$);

  useEffect(() => {
    if (!device?.group && !kiosk.offlineMode$.get()) {
      kiosk.page$.set('pairing');
    }
  }, [device]);

  if (page === 'kiosk' || page === 'codePin' || page === 'pairing') {
    return (
      <div {...c('')}>
        <Corners />
        <KioskRouter />
        <DialogContainer />
      </div>
    );
  }

  return (
    <Page menu={KioskMenu}>
      <Corners />
      <KioskRouter />
      <DialogContainer />
    </Page>
  );
};

export const KioskApp = () => {
  return <KioskContent />;
};
