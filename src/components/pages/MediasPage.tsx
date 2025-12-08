import { Css } from 'fluxio';
import { Page } from './base/Page';
import { Medias } from '../panels/Medias';
import { JobsWindow } from '../panels/Jobs';

const c = Css('MediasPage', {
  '': { alignContent: 'stretch' },
});

export const MediasPage = () => {
  return (
    <Page {...c('')}>
      <Medias />
      <JobsWindow />
    </Page>
  );
};

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
