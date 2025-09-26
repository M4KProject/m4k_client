import { Css } from '@common/ui';
import {
  BackButton,
  Button,
  Page,
  PageBody,
  Toolbar,
  tooltip,
  UploadButton,
} from '@common/components';
import { MediaTable } from '../components/medias/MediaTable';
import { SearchField } from '../components/SearchField';
import {
  getNextTitle,
  mediaCtrl,
  setIsEdit,
  setMediaKey,
  setMediaType,
  useIsEdit,
  useItemKey,
  useMediaKey,
  useMediaType,
} from '../controllers';
import { AddPlaylistItemButton, EditPlaylist } from '../components/medias/EditPlaylist';
import { needAuthId, needGroupId, PlaylistModel, upload } from '@common/api';
import { Edit, FolderPlus, MapPlus, Play, Upload } from 'lucide-react';

const c = Css('MediasPage', {});

const handleAddToPlaylist = async () => {};

const handleCreatePlaylist = async () => {
  const playlist = await mediaCtrl.create({
    title: getNextTitle('Playlist'),
    mime: 'application/playlist',
    type: 'playlist',
    user: needAuthId(),
    group: needGroupId(),
  });
  setMediaType('playlist');
  setMediaKey(playlist.key);
};

export const MediasPage = () => {
  const type = useMediaType();
  const mediaKey = useMediaKey();
  const media = useItemKey(mediaCtrl, mediaKey);
  const isEdit = useIsEdit();

  let content = null;

  if (type === 'playlist' && isEdit) {
    content = <EditPlaylist playlist={media as PlaylistModel} />;
  } else {
    content = <MediaTable type={type} />;
  }

  return (
    <Page class={c('Page')}>
      <Toolbar title="Medias">
        {media && <BackButton onClick={() => setMediaKey('')} />}

        {media?.type === 'playlist' && <AddPlaylistItemButton playlist={media as PlaylistModel} />}

        {media &&
          (isEdit ? (
            <Button icon={<Play />} title="Afficher le media" onClick={() => setIsEdit(false)} />
          ) : (
            <Button icon={<Edit />} title="Éditer le media" onClick={() => setIsEdit(true)} />
          ))}

        {media?.type === 'playlist' ? (
          <Button
            icon={<MapPlus />}
            {...tooltip('Ajouter à la playlist')}
            onClick={handleAddToPlaylist}
          >
            Ajouter à la Playlist
          </Button>
        ) : (
          <Button
            icon={<MapPlus />}
            {...tooltip('Créer une playlist')}
            onClick={handleCreatePlaylist}
          >
            Crée une Playlist
          </Button>
        )}

        {type === '' && (
          <Button
            icon={<FolderPlus />}
            {...tooltip('Créer un nouveau dossier')}
            onClick={() => {
              mediaCtrl.create({
                title: getNextTitle('Dossier'),
                mime: 'application/folder',
                type: 'folder',
                user: needAuthId(),
                group: needGroupId(),
              });
            }}
          >
            Nouveau dossier
          </Button>
        )}

        <UploadButton
          title="Téléverser"
          {...tooltip('Téléverser des medias')}
          icon={<Upload />}
          color="primary"
          onFiles={(files) => upload(files, media?.id)}
        />

        <SearchField />
      </Toolbar>
      <PageBody>{content}</PageBody>
    </Page>
  );
};
