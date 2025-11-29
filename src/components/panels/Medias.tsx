import { Css } from 'fluxio';
import { useGroupMedias } from '@/hooks/useApi';
import { MediaModel } from '@/api/models';
import { useFlux } from '@/hooks/useFlux';
import { useMediaController } from '@/hooks/useMediaController';
import { Button } from '../common/Button';
import { ArrowLeftIcon } from 'lucide-react';
import { useEffect } from 'preact/hooks';
import { MediaItem } from '@/components/panels/MediaItem';
import { MediaBreadcrumb } from '@/components/panels/MediaBreadcrumb';

const c = Css('Medias', {
  '': {
    rowWrap: 1,
    p: 8,
  },
  Back: {
    wh: 100,
    col: ['center', 'around'],
  },
  'Back .lucide': {
    wh: 50,
  },
  'Back .ButtonContent': {
    flex: 0,
  },
});

// addTr({
//   pending: 'en attente',
//   uploading: 'téléchargement',
//   processing: 'traitement',
//   failed: 'échec',
//   success: 'succès',
// });

export const Medias = ({ type }: { type?: MediaModel['type'] }) => {
  const controller = useMediaController();
  const medias = useGroupMedias(type);
  const parent = useFlux(controller.parent$);
  const parentId = parent?.id;

  useEffect(() => controller.medias$.set(medias), [medias]);

  console.debug('Medias', medias, parentId);

  return (
    <div {...c('')}>
      <MediaBreadcrumb />
      {parent && (
        <Button
          {...c('Back')}
          color="secondary"
          icon={ArrowLeftIcon}
          title="Retour"
          onClick={controller.back}
        />
      )}
      {medias.filter(m => m && (m.parent||'') === (parentId||'')).map(media => (
        <MediaItem key={media.id} media={media} />
      ))}
    </div>
  );
};





// const c = Css('MediasPage', {});

// const handleAddToPlaylist = async () => {};

// export const MediasPage = () => {
//   const api = useApi();
//   const type = useMediaType();
//   const media = useMedia();
//   const mediaById = useMediaById();
//   const isEdit = useIsEdit();

//   let content = null;

//   const isPlaylist = type === 'playlist' && media?.type === 'playlist' && isEdit;
//   const isPage = type === 'page' && media?.type === 'page' && isEdit;
//   const isMedia = media && !isEdit;

//   if (isPlaylist) {
//     content = (
//       <PageBody>
//         <EditPlaylist playlist={media as PlaylistModel} />
//       </PageBody>
//     );
//   } else if (isPage) {
//     // content = <EditPage page={media as PageModel} />;
//   } else if (isMedia) {
//     content = <MediaView media={media} mediaById={mediaById} />;
//   } else {
//     content = (
//       <PageBody>
//         <MediaGrid type={type} />
//       </PageBody>
//     );
//   }

//   return (
//     <Page {...c('Page')} side={isPage ? null : AdminSideBar}>
//       <Toolbar title="Medias">
//         {/* {media && <BackButton onClick={() => setMediaKey('')} />} */}

//         {media?.type === 'playlist' && <AddPlaylistItemButton playlist={media as PlaylistModel} />}
//         {/* {media?.type === 'page' && <AddPageBoxButton page={media as PageModel} />} */}

//         {media &&
//           (isEdit ?
//             <Button icon={Play} title="Afficher le media" onClick={() => setIsEdit(false)} />
//           : <Button icon={Edit} title="Éditer le media" onClick={() => setIsEdit(true)} />)}

//         {/* <Button
//           icon={MapPlus}
//           tooltip="Ajouter à la playlist"
//           onClick={handleAddToPlaylist}
//         >
//           Ajouter à la Playlist
//         </Button> */}

//         {type === 'playlist' && (
//           <Button icon={MapPlus} tooltip="Créer une playlist" onClick={() => addPlaylist(api)}>
//             Crée une Playlist
//           </Button>
//         )}

//         {type === 'page' && (
//           <Button icon={FilePlus} tooltip="Créer une page" onClick={() => addPage(api)} />
//         )}

//         {type === '' && (
//           <Button
//             icon={FolderPlus}
//             tooltip="Créer un nouveau dossier"
//             onClick={() => {
//               api.media.create({
//                 title: getNextTitle(api, 'Dossier'),
//                 mime: 'application/folder',
//                 type: 'folder',
//                 user: api.needAuthId(),
//                 group: api.needGroupId(),
//               });
//             }}
//           >
//             Nouveau dossier
//           </Button>
//         )}

//         <UploadButton
//           tooltip="Téléverser des medias"
//           icon={Upload}
//           color="primary"
//           onFiles={(files) => {
//             if (media?.type === 'playlist') {
//               uploadMedia(api, files, media.parent ? mediaById[media.parent] : undefined, media);
//               return;
//             }
//             if (media?.type === 'folder') {
//               uploadMedia(api, files, media);
//               return;
//             }
//             uploadMedia(api, files);
//           }}
//         />

//         {/* <SearchField /> */}
//       </Toolbar>
//       {content}
//     </Page>
//   );
// };
