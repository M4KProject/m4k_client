// import { Css } from '@common/ui';
// import { VideoModel } from '@/api';
// import { getVariants } from '@/api/getVariants';
// import { getMediaUrl } from '@/api/getMediaUrl';
// import { MediaViewProps } from './BaseView';

// const c = Css('VideoView', {
//   '': {
//     bgMode: 'cover',
//   },
//   Video: {
//     wh: '100%',
//     itemFit: 'fill',
//   },
//   'Video-contain': {
//     itemFit: 'contain',
//   },
//   'Video-cover': {
//     itemFit: 'cover',
//   },
//   'Video-fill': {
//     itemFit: 'fill',
//   },
// });

// export type VideoViewProps = MediaViewProps<VideoModel>;

// export const VideoView = ({ media, onNext, fit, ...props }: VideoViewProps) => {
//   const variants = getVariants(media);
//   const videos = variants.filter((v) => v.type === 'video');
//   const images = variants.filter((v) => v.type === 'image');
//   const posterImage = images[0];

//   return (
//     <div
//       {...props}
//       class={c('', props)}
//       style={{
//         backgroundImage: posterImage ? `url('${getMediaUrl(posterImage)}')` : undefined,
//         ...props.style,
//       }}
//     >
//       <video
//         class={c('Video', fit && `Video-${fit}`)}
//         controls={false}
//         autoPlay={true}
//         muted={true}
//         onEnded={onNext}
//         onError={(e) => {
//           console.warn('Video load error:', e);
//           onNext?.();
//         }}
//       >
//         {videos.map((v, i) => (
//           <source key={i} type={v.mime} src={getMediaUrl(v)} />
//         ))}
//         Votre navigateur ne supporte pas la lecture vidéo.
//       </video>
//     </div>
//   );
// };
