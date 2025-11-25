import { Css } from 'fluxio';
import { JSX } from 'preact';
import { page$, PageName } from '@/controllers/page$';
import { LoadingPage } from '@/components/device/LoadingPage';
import { MonitorSpeaker, Settings, Bug, Calendar, List, Wrench } from 'lucide-react';
import { CodePinPage } from '@/components/device/CodePinPage';
import { ConfigPlaylistPage } from '@/components/device/ConfigPlaylistPage';
import { TestPage } from '@/components/device/TestPage';
import { Corners } from './Corners';
import { KioskPage } from '@/components/device/KioskPage';
import { ActionsPage } from '@/components/device/ActionsPage';
import { EventsPage } from '@/components/device/EventsPage';
import { PlaylistPage } from '@/components/device/PlaylistPage';
import { PairingPage } from '@/components/device/PairingPage';
import { useEffect } from 'preact/hooks';
import { offlineMode$ } from '@/controllers/deviceMessages';
import { DialogContainer } from './DialogContainer';
import { useFlux } from '@/hooks/useFlux';
import { Side, SideButton, SideSep } from '@/components/common/Side';
import { useDeviceController } from '@/hooks/useDeviceController';

const c = Css('DeviceApp', {
  '': {
    row: 'stretch',
    position: 'fixed',
    overflow: 'hidden',
    inset: 0,
    bg: 'bg',
    fg: 't',
    fontFamily: 'Roboto',
  },
  '-loading': {
    center: 1,
  },
});

const CompByPage: Record<PageName, () => JSX.Element> = {
  '': KioskPage,
  kiosk: KioskPage,
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

const DeviceAppRouter = () => {
  const page = useFlux(page$);
  const Page = CompByPage[page] || ActionsPage;
  return <Page />;
};

const DeviceAppContent = () => {
  const deviceCtrl = useDeviceController();

  useEffect(() => {
    deviceCtrl.init();
  }, []);

  const page = useFlux(page$);
  const device = useFlux(deviceCtrl.device$);

  useEffect(() => {
    if (!device?.group && !offlineMode$.get()) {
      page$.set('pairing');
    }
  }, [device]);

  const go = (page: PageName) => () => page$.set(page);

  return (
    <div {...c('')}>
      {page !== 'kiosk' && page !== 'codePin' && page !== 'pairing' && (
        <Side>
          <SideSep />
          <SideButton
            selected={page === ''}
            icon={MonitorSpeaker}
            title="Kiosk"
            onClick={go('kiosk')}
          />
          <SideButton
            selected={page === 'actions'}
            icon={Wrench}
            title="Actions"
            onClick={go('actions')}
          />
          {/* <SideButton icon={<KeyRound />} page="password" title="Mot de passe" /> */}
          <SideButton
            selected={page === 'playlist'}
            icon={List}
            title="Playlist"
            onClick={go('playlist')}
          />
          <SideButton
            selected={page === 'configPlaylist'}
            icon={Settings}
            title="Config"
            onClick={go('configPlaylist')}
          />
          {/* <SideButton icon={<MdWifi />} page="wifi" title="Wifi" /> */}
          <SideSep />
          <SideButton selected={page === 'test'} icon={Bug} title="Test" onClick={go('test')} />
          {/* <SideButton icon={<MdListAlt />} page="logs" title="Logs" /> */}
          <SideButton
            selected={page === 'events'}
            icon={Calendar}
            title="Events"
            onClick={go('events')}
          />
          <SideSep />
          {/* <SideButton icon={<User />} page="account" title="Mon Compte" /> */}
          {/* <SideSep style={{ fontSize: 0.7, opacity: 0.5 }}>2.0.0</SideSep> */}
        </Side>
      )}
      <Corners />
      <DeviceAppRouter />
      <DialogContainer />
    </div>
  );
};

export const DeviceApp = () => {
  return <DeviceAppContent />;
};
