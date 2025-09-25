import { addTr } from '@common/hooks';
import { Css } from '@common/ui';
import { Side, SideButton, SideSep } from '@common/components';
import { Home, Users, Monitor, User, Zap } from 'lucide-react';
import { groupCtrl } from '../controllers';
import { MediaIcon } from './medias/MediaIcon';
import { Page, setGroupKey, setPage, setRoute, useGroupKey, useIsAdvanced, usePage } from '../controllers/router';
import { useItemKey, useItems } from '../controllers/useItem';
import { MediaType } from '@common/api';

const c = Css('SideBar', {
  Version: {
    color: 'p8',
    bold: 1,
    borderBottom: '1px solid',
    bColor: 'p8',
    opacity: 0.5,
    p: 0,
    pl: 0.4,
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
  const isAdvanced = useIsAdvanced();
  const groupKey = useGroupKey();
  const group = useItemKey(groupCtrl, groupKey);
  const page = usePage();

  const groups = useItems(groupCtrl);
  if (groups.length === 1) setGroupKey(groups[0].key);

  const go = (page: Page) => () => setPage(page);

  const goMedias = (mediaType: MediaType) =>
    () => setRoute({ page: 'medias', mediaType });

  return (
    <Side>
      <SideSep />
      <SideButton
        curr={page}
        title={group?.name || 'Groups'}
        icon={<Home />}
        page="groups"
        onClick={go('groups')}
      />
      <SideSep />
      {group || isAdvanced ? (
        <>
          <SideButton
            curr={page}
            title="Members"
            icon={<Users />}
            page="members"
            onClick={go('members')}
          />
          <SideButton
            curr={page}
            title="Devices"
            icon={<Monitor />}
            page="devices"
            onClick={go('devices')}
          />
          <SideButton
            curr={page}
            title="Medias"
            icon={<MediaIcon type="folder" />}
            page="medias"
            onClick={goMedias('folder')}
          />
          <SideButton
            curr={page}
            tab={true}
            title="Playlists"
            icon={<MediaIcon type="playlist" />}
            page="playlists"
            onClick={goMedias('playlist')}
          />
          <SideButton
            curr={page}
            tab={true}
            title="Videos"
            icon={<MediaIcon type="video" />}
            page="videos"
            onClick={goMedias('video')}
          />
          <SideButton
            curr={page}
            tab={true}
            title="Images"
            icon={<MediaIcon type="image" />}
            page="images"
            onClick={goMedias('image')}
          />
          <SideButton
            curr={page}
            title="Jobs"
            icon={<Zap />}
            page="jobs"
            onClick={go('jobs')}
          />
        </>
      ) : null}
      <SideSep />
      <div class={c('Version')}>2.1.0</div>
      <SideButton
        curr={page}
        title="Account"
        icon={<User />}
        page="account" 
        onClick={go('account')}
      />
    </Side>
  );
};
