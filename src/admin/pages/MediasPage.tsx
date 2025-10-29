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
import { MediaTable } from '../components/medias/MediaGrid';
import { SearchField } from '../components/SearchField';
import { getNextTitle, uploadMedia } from '../controllers';
import { mediaSync } from '@/api/sync';
import { AddPlaylistItemButton, EditPlaylist } from '../components/medias/EditPlaylist';
import { MediaModel, needAuthId, needGroupId, PlaylistModel } from '@/api';
import { Edit, FolderPlus, MapPlus, FilePlus, Play, Upload } from 'lucide-react';
import { useIsEdit, useMediaType } from '@/router/hooks';
import { setIsEdit, setMediaKey, setMediaType } from '@/router/setters';
import { useMedia, useMediaById } from '@/api/hooks';
import { MediaView } from '@/components/medias';

const c = Css('MediasPage', {});

const handleAddToPlaylist = async () => {};

const addMedia = async (type: MediaModel['type'], title: string) => {
  const media = await mediaSync.create({
    title: getNextTitle(title),
    type,
    user: needAuthId(),
    group: needGroupId(),
  });
  setMediaType(type);
  setMediaKey(media.key);
}

const addPlaylist = () => addMedia('playlist', 'Playlist');
const addPage = () => addMedia('page', 'Page');

export const MediasPage = () => {
  const type = useMediaType();
  const media = useMedia();
  const mediaById = useMediaById();
  const isEdit = useIsEdit();

  let content = null;

  if (type === 'playlist' && media?.type === 'playlist' && isEdit) {
    content = <EditPlaylist playlist={media as PlaylistModel} />;
  } else if (media && !isEdit) {
    content = <MediaView media={media} mediaById={mediaById} />;
  } else {
    content = <MediaTable type={type} />;
  }

  return (
    <Page class={c('Page')}>
      <Toolbar title="Medias">
        {/* {media && <BackButton onClick={() => setMediaKey('')} />} */}

        {media?.type === 'playlist' && <AddPlaylistItemButton playlist={media as PlaylistModel} />}

        {media &&
          (isEdit ?
            <Button icon={<Play />} title="Afficher le media" onClick={() => setIsEdit(false)} />
          : <Button icon={<Edit />} title="Éditer le media" onClick={() => setIsEdit(true)} />)}

        {/* <Button
          icon={<MapPlus />}
          {...tooltip('Ajouter à la playlist')}
          onClick={handleAddToPlaylist}
        >
          Ajouter à la Playlist
        </Button> */}

        {type === 'playlist' && (
          <Button
            icon={<MapPlus />}
            {...tooltip('Créer une playlist')}
            onClick={addPlaylist}
          >
            Crée une Playlist
          </Button>
        )}

        {type === 'page' && (
          <Button
            icon={<FilePlus />}
            {...tooltip('Créer une page')}
            onClick={addPage}
          />
        )}

        {type === '' && (
          <Button
            icon={<FolderPlus />}
            {...tooltip('Créer un nouveau dossier')}
            onClick={() => {
              mediaSync.create({
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
          {...tooltip('Téléverser des medias')}
          icon={<Upload />}
          color="primary"
          onFiles={(files) => {
            if (media?.type === 'playlist') {
              uploadMedia(files, media.parent ? mediaById[media.parent] : undefined, media);
              return;
            }
            if (media?.type === 'folder') {
              uploadMedia(files, media);
              return;
            }
            uploadMedia(files);
          }}
        />

        {/* <SearchField /> */}
      </Toolbar>
      <PageBody>{content}</PageBody>
    </Page>
  );
};
