import { Css } from '@common/ui';
import {
  FileInfo,
  MediaModel,
  Thumb,
  getUrl,
  PlaylistEntry,
  PlaylistModel,
  VideoModel,
  PdfModel,
  ImageModel,
  FolderModel,
} from '@common/api';
import { groupBy, isStrDef, sortItems } from '@common/utils';
import { DivProps } from '@common/components';

export type MediaFit = 'contain' | 'cover' | 'fill';
export type MediaAnim = 'rightToLeft' | 'topToBottom' | 'fade' | 'zoom';

const c = Css('MediaView', {
  '': {
    position: 'absolute',
    overflow: 'hidden',
    fCenter: 1,
    wh: '100%',
    xy: 0,
  },

  // Video: {
  //   flex: 1,
  //   w: '100%',
  //   h: '100%',
  //   fCol: ['center', 'center'],
  // },
  // 'Video video': {
  //   maxW: '100%',
  //   maxH: '100%',
  // },
  // Image: {
  //   flex: 1,
  //   w: '100%',
  //   h: '100%',
  //   bgPosition: 'center',
  // },
  // Document: {
  //   flex: 1,
  //   w: '100%',
  //   h: '100%',
  //   fCol: ['center', 'center'],
  //   p: 2,
  //   bg: 'g100',
  // },
  // Placeholder: {
  //   flex: 1,
  //   fCol: ['center', 'center'],
  //   p: 2,
  //   fg: 'g500',
  //   fontSize: 1.2,
  // },
  // Playlist: {
  //   flex: 1,
  //   w: '100%',
  //   h: '100%',
  //   position: 'relative',
  // },
  // PlaylistItem: {
  //   position: 'absolute',
  //   inset: 0,
  //   transition: 'all 0.5s ease-in-out',
  // },
  // // Animations
  // 'PlaylistItem-rightToLeft-enter': {
  //   translateX: '100%',
  // },
  // 'PlaylistItem-rightToLeft-exit': {
  //   translateX: '-100%',
  // },
  // 'PlaylistItem-topToBottom-enter': {
  //   translateY: '-100%',
  // },
  // 'PlaylistItem-topToBottom-exit': {
  //   translateY: '100%',
  // },
  // 'PlaylistItem-fade-enter': {
  //   opacity: 0,
  // },
  // 'PlaylistItem-fade-exit': {
  //   opacity: 0,
  // },
  // 'PlaylistItem-zoom-enter': {
  //   scale: 0.8,
  //   opacity: 0,
  // },
  // 'PlaylistItem-zoom-exit': {
  //   scale: 1.2,
  //   opacity: 0,
  // },
  // 'PlaylistItem-active': {
  //   translateX: 0,
  //   translateY: 0,
  //   opacity: 1,
  //   scale: 1,
  // },
});

interface Variant extends FileInfo {
  media: MediaModel;
  file: string;
}

const getVariants = (media?: MediaModel): Variant[] => {
  if (!media || !media.data) return [];
  const results = [];
  media.data?.variants?.forEach((info, i) => {
    const file = media.variants[i];
    if (isStrDef(file)) {
      results.push({ ...info, file, media });
    }
  });
  if (isStrDef(media.source)) {
    const file = media.source;
    results.push({ ...media, file, media });
  }
  return results;
};

const getMediaUrl = (v?: Variant, thumb?: Thumb) =>
  (v && getUrl('medias', v.media.id, v.file, thumb)) || '';

// Helper pour récupérer les médias d'une playlist
// Note: Cette fonction nécessiterait idéalement un hook pour récupérer les médias complets
// Pour l'instant, elle retourne des médias partiels avec seulement l'ID
const getPlaylistMedias = (media: MediaModel, allMedias?: MediaModel[]): MediaModel[] => {
  if (media.type !== 'playlist' || !media.data?.items) return [];

  return media.data.items
    .map((item: PlaylistEntry) => {
      if (typeof item.media === 'string') {
        // Chercher le média complet dans allMedias si fourni
        const fullMedia = allMedias?.find((m) => m.id === item.media);
        return (
          fullMedia || ({ id: item.media, title: item.title || 'Média inconnu' } as MediaModel)
        );
      }
      return null;
    })
    .filter((media): media is MediaModel => media !== null);
};

export interface MediaConfig {
  fit?: MediaFit;
  anim?: MediaAnim;
  seconds?: number;
}

export type MediaViewProps<T extends MediaModel = MediaModel> = DivProps &
  MediaConfig & {
    media?: T;
  };

export const PlaylistView = ({ media, ...props }: MediaViewProps<PlaylistModel | FolderModel>) => {
  const data = media.data || {};
  const items = data.items || (media.deps || []).map((id) => ({ media: id }));

  return <div {...props} class={c(props)}></div>;
};

export const VideoView = ({ media, ...props }: MediaViewProps<VideoModel>) => {
  const variants = getVariants(media);
  const images = variants.filter((v) => v.type === 'image');
  const videos = variants.filter((v) => v.type === 'video');

  return (
    <div {...props} class={c(props)}>
      <video
        controls={false}
        autoPlay={true}
        muted={true}
        onError={(e) => {
          console.warn('Video load error:', e);
        }}
      >
        {videos.map((v, i) => (
          <source key={i} type={v.mime} src={getMediaUrl(v)} />
        ))}
        Votre navigateur ne supporte pas la lecture vidéo.
      </video>
    </div>
  );
};

export const PdfView = ({ media, ...props }: MediaViewProps<PdfModel>) => {
  const variants = getVariants(media);
  const images = variants.filter((v) => v.type === 'image');
  const imagesByPage = groupBy(images, (i) => i.page);
  const pages = sortItems(Object.keys(imagesByPage), Number);

  return <div {...props} class={c(props)} />;
};

export const ImageView = ({ media, ...props }: MediaViewProps<ImageModel>) => {
  const variants = getVariants(media);
  const images = variants.filter((v) => v.type === 'image');

  return <div {...props} />;
};

export const PageView = (props: MediaViewProps<MediaModel>) => {
  return (
    <div {...props} class={c(props)}>
      TODO
    </div>
  );
};

export const EmptyView = (props: MediaViewProps<MediaModel>) => {
  return <div {...props}>Type de média non supporté: {props.media?.type}</div>;
};

const contentByType = {
  playlist: PlaylistView,
  folder: PlaylistView,
  video: VideoView,
  pdf: PdfView,
  image: ImageView,
  page: PageView,
};

export const MediaView = (props: MediaViewProps) => {
  const { media } = props;
  const type = media?.type || 'empty';
  const Content = contentByType[type] || EmptyView;

  return <Content {...(props as MediaViewProps<any>)} class={c('', `-${type}`, props)} />;
};

//   const timerRef = useRef<any>();

//   // Timer pour passer au média suivant automatiquement
//   useEffect(() => {
//     if (seconds && go && next !== undefined) {
//       timerRef.current = setTimeout(() => {
//         go(next);
//       }, seconds * 1000);
//     }
//     return () => {
//       if (timerRef.current) {
//         clearTimeout(timerRef.current);
//       }
//     };
//   }, [seconds, go, next, curr]);

//   // Gestion des playlists
//   if (media.type === 'playlist') {
//     const playlistMedias = getPlaylistMedias(media, allMedias);
//     const currentMedia = curr !== undefined ? playlistMedias[curr] : null;

//     if (!currentMedia) {
//       return (
//         <div class={c('', 'Placeholder', props)}>
//           <div>Playlist vide ou média introuvable</div>
//         </div>
//       );
//     }

//     return (
//       <div class={c('', 'Playlist', props)}>
//         <div class={c('', 'PlaylistItem', 'PlaylistItem-active', props)}>
//           <MediaView
//             media={currentMedia}
//             autoPlay={autoPlay}
//             controls={controls}
//             fit={fit}
//             // Pas de récursion des props playlist
//           />
//         </div>
//       </div>
//     );
//   }

//   // Helper pour appliquer le fit style
//   const getFitStyle = (fitMode: MediaFit) => {
//     switch (fitMode) {
//       case 'cover': return { bgMode: 'cover', objectFit: 'cover' };
//       case 'fill': return { bgMode: 'fill', objectFit: 'fill' };
//       default: return { bgMode: 'contain', objectFit: 'contain' };
//     }
//   };

//   const fitStyle = getFitStyle(fit);

//   // Affichage vidéo
//   if (videos.length > 0) {
//     return (
//       <div class={c('', 'Video', props)}>

//       </div>
//     );
//   }

//   // Affichage image
//   if (images.length > 0) {
//     return (
//       <div
//         class={c('', 'Image', props)}
//         style={{
//           backgroundImage: `url('${getMediaUrl(images[0])}')`,
//           backgroundSize: fitStyle.bgMode,
//         }}
//       />
//     );
//   }

//   // Affichage document PDF
//   if (media.type === 'pdf' && media.source) {
//     return (
//       <div class={c('', 'Document', props)}>
//         <iframe
//           src={getUrl('medias', media.id, media.source)}
//           style={{ width: '100%', height: '100%', border: 'none' }}
//           title={media.title}
//         />
//       </div>
//     );
//   }

//   // Fallback pour les autres types
//   return (
//     <div class={c('', 'Placeholder', props)}>
//       <div>Type de média non supporté: {media.type}</div>
//       <div>{media.title}</div>
//     </div>
//   );
// };
