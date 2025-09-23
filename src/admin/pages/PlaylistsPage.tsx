import { Css } from '@common/ui';
import { BackButton, Button, Page, PageBody, Toolbar } from '@common/components';
import { MediaTable } from '../components/medias/MediaTable';
import { useMsg, useQueryOne } from '@common/hooks';
import { mediaId$ } from '../messages';
import { mediaCtrl } from '@/colls';
import { NewPlaylistButton } from '../components/medias/NewPlaylistButton';
import { UploadMediaButton } from '../components/medias/UploadMediaButton';
import { SearchField } from '../components/SearchField';
import { PlaylistModel } from '@common/api';
import { AddPlaylistItemButton, EditPlaylist } from '../components/medias/EditPlaylist';

const c = Css('PlaylistsPage', {});

export const PlaylistsPage = () => {
  const id = useMsg(mediaId$);
  const playlist = useQueryOne(mediaCtrl, id) as PlaylistModel;

  console.debug('PlaylistsPage', id, playlist);

  if (playlist && playlist.type === 'playlist') {
    return (
      <Page class={c('Page')}>
        <Toolbar title="Playlists">
          <BackButton onClick={() => mediaId$.set('')} />
          <AddPlaylistItemButton playlist={playlist} />
          <UploadMediaButton parent={playlist.id} />
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
        <NewPlaylistButton />
        <UploadMediaButton />
        <SearchField />
      </Toolbar>
      <PageBody>
        <MediaTable type="playlist" />
      </PageBody>
    </Page>
  );
};
