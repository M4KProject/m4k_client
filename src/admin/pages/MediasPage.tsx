import { Css } from 'fluxio';
import { MediaGrid } from '../components/medias/MediaGrid';
import { getNextTitle, uploadMedia } from '../controllers';
import { AddPlaylistItemButton, EditPlaylist } from '../components/medias/EditPlaylist';
import { EditPage } from '../components/medias/EditPage';
import { Edit, FolderPlus, MapPlus, FilePlus, Play, Upload } from 'lucide-react';
import { useIsEdit, useMediaType } from '@/router/hooks';
import { setIsEdit, setMediaKey, setMediaType } from '@/router/setters';
import { useApi, useMedia, useMediaById } from '@/hooks/apiHooks';
import { MediaModel, PageModel, PlaylistModel } from '@/api/models';
import { needAuthId } from '@/api/needAuthId';
import { needGroupId } from '@/api/groupId$';
import { Page, PageBody } from '@/components/Page';
import { MediaView } from '@/medias/MediaView';
import { Toolbar } from '@/components/Toolbar';
import { Button, UploadButton } from '@/components/Button';
import { tooltip } from '@/components/Tooltip';
import { ApiCtrl } from '@/api/ApiCtrl';

const c = Css('MediasPage', {});

const handleAddToPlaylist = async () => {};

const addMedia = async (api: ApiCtrl, type: MediaModel['type'], title: string) => {
  const media = await api.media.create({
    title: getNextTitle(api, title),
    type,
    user: needAuthId(),
    group: needGroupId(),
  });
  setMediaType(type);
  setMediaKey(media.key);
};

const addPlaylist = (api: ApiCtrl) => addMedia(api, 'playlist', 'Playlist');
const addPage = (api: ApiCtrl) => addMedia(api, 'page', 'Page');

export const MediasPage = () => {
  const api = useApi();
  const type = useMediaType();
  const media = useMedia();
  const mediaById = useMediaById();
  const isEdit = useIsEdit();

  let content = null;

  if (type === 'playlist' && media?.type === 'playlist' && isEdit) {
    content = (
      <PageBody>
        <EditPlaylist playlist={media as PlaylistModel} />
      </PageBody>
    );
  } else if (type === 'page' && media?.type === 'page' && isEdit) {
    content = <EditPage page={media as PageModel} />;
  } else if (media && !isEdit) {
    content = <MediaView media={media} mediaById={mediaById} />;
  } else {
    content = (
      <PageBody>
        <MediaGrid type={type} />
      </PageBody>
    );
  }

  return (
    <Page {...c('Page')}>
      <Toolbar title="Medias">
        {/* {media && <BackButton onClick={() => setMediaKey('')} />} */}

        {media?.type === 'playlist' && <AddPlaylistItemButton playlist={media as PlaylistModel} />}
        {/* {media?.type === 'page' && <AddPageBoxButton page={media as PageModel} />} */}

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
          <Button icon={<MapPlus />} {...tooltip('Créer une playlist')} onClick={() => addPlaylist(api)}>
            Crée une Playlist
          </Button>
        )}

        {type === 'page' && (
          <Button icon={<FilePlus />} {...tooltip('Créer une page')} onClick={() => addPage(api)} />
        )}

        {type === '' && (
          <Button
            icon={<FolderPlus />}
            {...tooltip('Créer un nouveau dossier')}
            onClick={() => {
              api.media.create({
                title: getNextTitle(api, 'Dossier'),
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
              uploadMedia(api, files, media.parent ? mediaById[media.parent] : undefined, media);
              return;
            }
            if (media?.type === 'folder') {
              uploadMedia(api, files, media);
              return;
            }
            uploadMedia(api, files);
          }}
        />

        {/* <SearchField /> */}
      </Toolbar>
      {content}
    </Page>
  );
};
