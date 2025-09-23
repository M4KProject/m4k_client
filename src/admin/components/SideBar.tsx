import { addTr, useMsg } from '@common/hooks';
import { Css } from '@common/ui';
import { Side, SideButton, SideSep } from '@common/components';
import { Home, Users, Monitor, User, Zap } from 'lucide-react';
import { group$, isAdvanced$ } from '../messages';
import { AdminPage, adminPage$ } from '../messages/adminPage$';
import { useQuery } from '@common/hooks/useQuery';
import { groupCtrl } from '../controllers';
import { MediaIcon } from './MediaIcon';

const c = Css('SideBar', {
  Version: {
    color: '#0a536f',
    fontWeight: 'bold',
    borderBottom: '1px solid #0a536f',
    opacity: 0.5,
    p: 0,
    pl: 0.7,
  },
});

addTr({
  Groups: 'Groupes',
  Members: 'Membres',
  Devices: 'Appareils',
  Medias: 'Médias',
  Playlists: 'Playlists',
  Videos: 'Vidéos',
  Images: 'Images',
  Jobs: 'Jobs',
  Account: 'Mon Compte',
});

export const SideBar = () => {
  const isAdvanced = useMsg(isAdvanced$);
  const group = useMsg(group$);

  const groups = useQuery(groupCtrl);
  if (groups.length === 1) group$.set(groups[0]);

  const go = (page: AdminPage) => () => adminPage$.set(page);

  return (
    <Side page$={adminPage$}>
      <SideSep />
      <SideButton
        title={group?.name || 'Groups'}
        icon={<Home />}
        page="groups"
        onClick={go('groups')}
      />
      <SideSep />
      {group || isAdvanced ? (
        <>
          <SideButton title="Members" icon={<Users />} page="members" onClick={go('members')} />
          <SideButton title="Devices" icon={<Monitor />} page="devices" onClick={go('devices')} />
          <SideButton
            title="Medias"
            icon={<MediaIcon type="folder" />}
            page="medias"
            onClick={go('medias')}
          />
          <SideButton
            tab={true}
            title="Playlists"
            icon={<MediaIcon type="playlist" />}
            page="playlists"
            onClick={go('playlists')}
          />
          <SideButton
            tab={true}
            title="Videos"
            icon={<MediaIcon type="video" />}
            page="videos"
            onClick={go('videos')}
          />
          <SideButton
            tab={true}
            title="Images"
            icon={<MediaIcon type="image" />}
            page="images"
            onClick={go('images')}
          />
          <SideButton title="Jobs" icon={<Zap />} page="jobs" onClick={go('jobs')} />
        </>
      ) : null}
      <SideSep />
      <div class={c('Version')}>2.0.0</div>
      <SideButton title="Account" icon={<User />} page="account" onClick={go('account')} />
    </Side>
  );
};
