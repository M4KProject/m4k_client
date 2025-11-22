import { Css } from 'fluxio';
import { Home, Users, Monitor, User, Zap } from 'lucide-react';
import { setGroupKey, setPage, updateRoute } from '@/router/setters';
import { useIsAdvanced, useMediaType, usePage } from '@/router/hooks';
import { Page } from '@/router/types';
import { Side, SIDE_MIN, SideButton, SideSep } from '@/components/Side';
import { addTr } from '@/hooks/useTr';
import { MediaType } from '@/api/models';
import { useGroup, useGroups } from '@/hooks/apiHooks';
import { MediaIcon } from '@/components/admin/MediaIcon';

const c = Css('SideBar', {
  Version: {
    color: 'p',
    bold: 1,
    borderBottom: 1,
    borderColor: 'p',
    opacity: 0.3,
    fontSize: '12px',
    center: 1,
    w: SIDE_MIN,
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

export const AdminSideBar = () => {
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
        icon={Home}
        selected={page === 'groups'}
        onClick={go('groups')}
      />
      <SideSep />
      {group || isAdvanced ?
        <>
          <SideButton
            title="Members"
            icon={Users}
            selected={page === 'members'}
            onClick={go('members')}
          />
          <SideButton
            title="Devices"
            icon={Monitor}
            selected={page === 'devices'}
            onClick={go('devices')}
          />
          <SideButton
            title="Medias"
            icon={<MediaIcon type="folder" />}
            selected={page === 'medias' && !mediaType}
            onClick={goMedias('')}
          />

          {/* {page === 'medias' ?
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
          : null} */}
          {isAdvanced && (
            <SideButton title="Jobs" icon={Zap} selected={page === 'jobs'} onClick={go('jobs')} />
          )}
        </>
      : null}
      <SideSep />
      <div {...c('Version')}>2.2</div>
      <SideButton
        title="Account"
        icon={User}
        selected={page === 'account'}
        onClick={go('account')}
      />
    </Side>
  );
};

export const SideBar = AdminSideBar;
