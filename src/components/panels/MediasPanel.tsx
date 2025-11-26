import { Css, isEmpty, truncate } from 'fluxio';
import { useApi, useGroupMedias } from '@/hooks/useApi';
import { MediaModel } from '@/api/models';
import { useFlux } from '@/hooks/useFlux';
import { useMediaController } from '@/hooks/useMediaController';
import { Button } from "../common/Button";
import { MediaIcon } from '../medias/MediaIcon';
import { MediaPreview } from '../medias/MediaPreview';
import { useState } from 'preact/hooks';
import { Variant } from '@/api/Api';
import { useOver } from '@/hooks/useOver';

const W = 200;
const H = 140;

const c = Css('MediasPanel', {
  '': {
    rowWrap: 1,
    p: 8,
  },
  Item: {
    col: ['center', 'center'],
    w: W,
    m: 4,
    cursor: 'pointer',
  },
  ItemTitle: {
    textAlign: 'center',
    w: W,
  },
  Preview: {
    position: 'relative',
    w: W,
    h: H,
    bgMode: 'contain',
    m: 4,
    center: 1,
  },
  'Preview img, Preview video': {
    position: 'absolute',
    wMax: '100%',
    hMax: '100%',
    bg: 'bg',
    elevation: 1,
    rounded: 7,
    objectFit: 'contain',
  },
  'Preview video': {
    anim: {
      count: 1,
      duration: 1,
      keyframes: {
        0: { opacity: 0 },
        10: { opacity: 0 },
        100: { opacity: 1 },
      }
    }
  }
});

// addTr({
//   pending: 'en attente',
//   uploading: 'téléchargement',
//   processing: 'traitement',
//   failed: 'échec',
//   success: 'succès',
// });

export const MediaItem = ({ media }: { media: MediaModel }) => {
  const [over, overProps] = useOver();
  const controller = useMediaController();
  const api = useApi();

  if (!media) return null;

  const variants = api.getVariants(media);
  const images = variants.filter((v) => v.type === 'image');
  const videos = variants.filter((v) => v.type === 'video');

  const previewUrl = api.getMediaUrl(images[0], 360);

  const preview = [<img key="i" src={previewUrl} />];

  if (over && !isEmpty(videos)) {
    preview.push(
      <video
        key="v"
        controls={false}
        muted
        autoPlay
        loop
        onLoadStart={(e) => {
          console.debug('Video LoadStart:', e);
          e.currentTarget.currentTime = 0;
        }}
        onError={(e) => {
          console.warn('Video Error:', e);
        }}
      >
        {videos.map((v, i) => (
          <source key={i} type={v.mime} src={api.getMediaUrl(v)} />
        ))}
      </video>
    );
  }

  // return (
  //   <Button
  //     {...c('')}
  //     icon
  //     tooltip={() =>
  //       videos.length ?
  //         <video
  //           {...c('Video')}
  //           controls={false}
  //           muted
  //           autoPlay
  //           loop
  //           onLoadStart={(e) => {
  //             e.currentTarget.currentTime = 0;
  //           }}
  //           onError={(e) => {
  //             console.warn('Video preview error:', e);
  //           }}
  //         >
  //           {videos.map((v, i) => (
  //             <source key={i} type={v.mime} src={api.getMediaUrl(v)} />
  //           ))}
  //         </video>
  //       : <div
  //           {...c('Image')}
  //           style={{
  //             backgroundImage: `url('${api.getMediaUrl(images[0], 360)}')`,
  //           }}
  //         />
  //     }
  //     style={{
  //       backgroundImage: `url('${api.getMediaUrl(images[0], 360)}')`,
  //     }}
  //   />
  // );

  return (
    <div {...c('Item', over && 'Item-over')} {...overProps}>
      <div {...c('Preview')}>{preview}</div>
      <div {...c('ItemTitle')}>{truncate(media.title, 20)}</div>
    </div>
  );
}

export const MediasPanel = ({ type }: { type?: MediaModel['type'] }) => {
  const controller = useMediaController();
  const medias = useGroupMedias(type);
  const parent = useFlux(controller.parent$);
  const parentId = parent?.id || '';

  // const isAdvanced = useIsAdvanced();
  // const allSelectedById = useFlux(selectedById$);
  // const selectedIds = Object.keys(allSelectedById).filter((id) => id && mediaById[id]);
  // const tabById: Dictionary<number> = {};
  // const rootMedias = mediasByParent[''] || [];
  // const deep = (medias: MediaModel[], tab: number) => {
  //   sortItems(medias, (m) => m.title ?? '');
  //   for (const media of medias) {
  //     const id = media.id;
  //     items.push(media);
  //     tabById[id] = tab;
  //     if (id && openById[id]) {
  //       const children = mediasByParent[id];
  //       if (children) deep(children, tab + 1);
  //     }
  //   }
  // };
  // deep(rootMedias, 0);

  console.debug('MediasPanel', medias);

  return (
    <div {...c('')}>
      {medias.filter(m => (m.parent||'') === parentId).map(media => (
        <MediaItem media={media} />
      ))}
    </div>
  );
};



// const cols: GridCols<MediaModel, MediasGridContext> = {
//   select: ['', ({ id }) => <SelectedField id={id} />, { w: 30 }],
//   title: [
//     'Titre',
//     ({ id, type, title }, { api, getTab, getIsOpen, setIsOpen, getChildren }) => (
//       <>
//         <div style={{ width: 24 * getTab(id) }} />
//         <div onClick={() => setIsOpen(id, !getIsOpen(id))}>
//           <MediaIcon
//             type={type}
//             isOpen={getIsOpen(id)}
//             hasChildren={type === 'folder' && getChildren(id).length > 0}
//           />
//         </div>
//         <Field value={title} onValue={(title) => api.media.update(id, { title })} />
//       </>
//     ),
//   ],
//   preview: ['Aperçu', (media) => <MediaPreview media={media} />, { w: 100 }],
//   size: [
//     'Poids',
//     ({ bytes }) => {
//       if (!bytes) return '';
//       const kb = bytes / 1024;
//       const mb = kb / 1024;
//       const gb = mb / 1024;
//       if (gb > 0.95) return round(gb, 2) + 'Go';
//       if (mb > 0.95) return round(mb, 2) + 'Mo';
//       if (kb > 0.95) return round(kb, 2) + 'Ko';
//       return bytes + 'o';
//     },
//     { w: 80 },
//   ],
//   resolution: [
//     'Résolution',
//     ({ width, height }) => (width || height ? `${width || 0}x${height || 0}` : ''),
//     { w: 100 },
//   ],
//   seconds: [
//     'Durée',
//     ({ seconds }) => (seconds && isUFloat(seconds) ? round(seconds) + 's' : ''),
//     { w: 80 },
//   ],
//   actions: [
//     '',
//     ({ id, key, type }, { selectedIds, getChildren, api }) => (
//       <>
//         {type === 'folder' && selectedIds.length > 0 && (
//           <Button
//             icon={FolderInput}
//             tooltip={`Ajouter ${selectedIds.length} élément(s) au dossier`}
//             onClick={async () => {
//               for (const selectId of selectedIds) {
//                 selectedById$.setItem(selectId, undefined);
//                 await api.media.update(selectId, { parent: id });
//               }
//             }}
//           />
//         )}
//         {type === 'playlist' && (
//           <>
//             <Button
//               icon={Edit}
//               tooltip="Configurer la playlist"
//               onClick={() => {
//                 updateRoute({
//                   page: 'medias',
//                   mediaType: 'playlist',
//                   mediaKey: key,
//                   isEdit: true,
//                 });
//               }}
//             />
//             {selectedIds.length > 0 && (
//               <Button
//                 icon={PlusSquare}
//                 tooltip={`Ajouter ${selectedIds.length} élément(s) à la playlist`}
//                 onClick={async () => {
//                   updatePlaylist(api, id, (playlist) => {
//                     if (playlist.data && playlist.data.items) {
//                       playlist.data.items = [
//                         ...playlist.data.items,
//                         ...selectedIds.map((id) => ({
//                           media: id,
//                         })),
//                       ];
//                     }
//                   });
//                 }}
//               />
//             )}
//           </>
//         )}
//         {type === 'page' && (
//           <Button
//             icon={Edit}
//             tooltip="Éditer la page"
//             onClick={() => {
//               updateRoute({
//                 page: 'medias',
//                 mediaType: 'page',
//                 mediaKey: key,
//                 isEdit: true,
//               });
//             }}
//           />
//         )}
//         <Button
//           icon={Eye}
//           tooltip="Afficher le media"
//           onClick={() => {
//             updateRoute({ mediaKey: key, isEdit: false });
//           }}
//         />
//         {type !== 'folder' && type !== 'playlist' && (
//           <Button
//             icon={Download}
//             tooltip="Télécharger"
//             onClick={() => api.startMediaDownload(id)}
//           />
//         )}
//         <Button
//           icon={Trash2}
//           color="error"
//           tooltip="Supprimer"
//           onClick={async () => {
//             for (const c of getChildren(id)) {
//               api.media.update(c.id, { parent: null as any });
//             }
//             api.media.delete(id);
//           }}
//         />
//       </>
//     ),
//     { w: 160, cls: c('Actions') },
//   ],
// };

// const openById$ = fluxDictionary<boolean>();

// export const getMediasByParent = (medias: MediaModel[]) => {
//   const mediaById = byId(medias);
//   const mediasByParent = groupBy(medias, (m) => m.parent || '');
//   const rootMedias = mediasByParent[''] || (mediasByParent[''] = []);
//   for (const parentId in mediasByParent) {
//     if (parentId) {
//       const parent = mediaById[parentId];
//       if (!parent && mediasByParent[parentId]) {
//         rootMedias.push(...mediasByParent[parentId]!);
//       }
//     }
//   }
//   return mediasByParent;
// };
