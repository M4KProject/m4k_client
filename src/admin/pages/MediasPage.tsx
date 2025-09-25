import { Css } from '@common/ui';
import { BackButton, Button, Page, PageBody, Toolbar } from '@common/components';
import { MediaTable } from '../components/medias/MediaTable';
import { NewFolderButton } from '../components/medias/NewFolderButton';
import { UploadMediaButton } from '../components/medias/UploadMediaButton';
import { SearchField } from '../components/SearchField';
import {
  mediaCtrl,
  setMediaKey,
  useIsEdit,
  useItemKey,
  useMediaKey,
  useMediaType,
} from '../controllers';
import { NewPlaylistButton } from '../components/medias/NewPlaylistButton';
import { EditPlaylist } from '../components/medias/EditPlaylist';
import { PlaylistModel } from '@common/api';
import { Edit, Play } from 'lucide-react';

const c = Css('MediasPage', {});

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
        {mediaKey && <BackButton onClick={() => setMediaKey('')} />}
        {mediaKey &&
          (isEdit ? (
            <Button
              icon={<Play />}
              title="Afficher le media"
              onClick={() => {
                // TODO: Implémenter l'affichage du media
              }}
            />
          ) : (
            <Button
              icon={<Edit />}
              title="Éditer le media"
              onClick={() => {
                // TODO: Implémenter l'affichage du media
              }}
            />
          ))}
        {type === 'playlist' || (type === '' && <NewPlaylistButton />)}
        {type === '' && <NewFolderButton />}
        <UploadMediaButton />
        <SearchField />
      </Toolbar>
      <PageBody>{content}</PageBody>
    </Page>
  );
};
