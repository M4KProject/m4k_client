import { addTr } from '@common/hooks';
import { Css } from '@common/ui';
import { Side, SideButton, SideSep } from '@common/components';
import { Home, Users, Monitor, User, Zap } from 'lucide-react';
import { MediaIcon } from './medias/MediaIcon';
import { setGroupKey, setPage, updateRoute } from '../../router/setters';
import { useGroup, useGroups } from '../../api/hooks';
import { MediaType } from '@common/api';
import { useIsAdvanced, useMediaType, usePage } from '@/router/hooks';
import { Page } from '@/router/types';

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
  const group = useGroup();
  const page = usePage();
  const mediaType = useMediaType();
  const groups = useGroups();

  if (groups.length === 1 && groups[0]) setGroupKey(groups[0].key);

  const go = (page: Page) => () => setPage(page);

  const goMedias = (mediaType: MediaType) => () =>
    updateRoute({
      page: 'medias',
      mediaType,
      mediaKey: '',
    });

  return (
    <Side>
      <SideSep />
      <SideButton
        title={group?.name || 'Groups'}
        icon={<Home />}
        selected={page === 'groups'}
        onClick={go('groups')}
      />
      <SideSep />
      {group || isAdvanced ?
        <>
          <SideButton
            title="Members"
            icon={<Users />}
            selected={page === 'members'}
            onClick={go('members')}
          />
          <SideButton
            title="Devices"
            icon={<Monitor />}
            selected={page === 'devices'}
            onClick={go('devices')}
          />
          <SideButton
            title="Medias"
            icon={<MediaIcon type="folder" />}
            selected={page === 'medias' && !mediaType}
            onClick={goMedias('')}
          />

          {page === 'medias' ?
            (
              [
                ['playlist', 'Playlists'],
                ['page', 'Pages'],
                ['video', 'Videos'],
                ['image', 'Images'],
                ['pdf', 'Fichiers PDF'],
              ] as [MediaType, string][]
            ).map(([type, title]) => (
              <SideButton
                key={type}
                tab={true}
                title={title}
                icon={<MediaIcon type={type} />}
                selected={page === 'medias' && mediaType === type}
                onClick={goMedias(type)}
              />
            ))
          : null}
          <SideButton title="Jobs" icon={<Zap />} selected={page === 'jobs'} onClick={go('jobs')} />
        </>
      : null}
      <SideSep />
      <div class={c('Version')}>2.1.0</div>
      <SideButton
        title="Account"
        icon={<User />}
        selected={page === 'account'}
        onClick={go('account')}
      />
    </Side>
  );
};
