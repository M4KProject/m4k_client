import { Css } from '@common/ui';
import { Page, PageBody, Toolbar } from '@common/components';
import { MediaTable } from '../components/medias/MediaTable';
import { mediaCtrl } from '@/colls';
import { SearchField } from '../components/SearchField';
import { PlaylistModel } from '@common/api';
import { AddPlaylistItemButton, EditPlaylist } from '../components/medias/EditPlaylist';
import { useMediaKey } from '../controllers/router';
import { useItemKey } from '../controllers/useItem';

const c = Css('PlaylistsPage', {});

export const PlaylistsPage = () => {
  const mediaKey = useMediaKey();
  const playlist = useItemKey(mediaCtrl, mediaKey) as PlaylistModel;

  console.debug('PlaylistsPage', mediaKey, playlist);

  if (playlist && playlist.type === 'playlist') {
    return (
      <Page class={c('Page')}>
        <Toolbar title="Playlists">
          <AddPlaylistItemButton playlist={playlist} />
          {/* <UploadMediaButton parent={playlist.id} /> */}
          <SearchField />
        </Toolbar>
        <PageBody>
          <EditPlaylist playlist={playlist} />
        </PageBody>
      </Page>
    );
  }

  return (
    <Page class={c('Page')}>
      <Toolbar title="Playlists">
        {/* <NewPlaylistButton />
        <UploadMediaButton /> */}
        <SearchField />
      </Toolbar>
      <PageBody>
        <MediaTable type="playlist" />
      </PageBody>
    </Page>
  );
};
