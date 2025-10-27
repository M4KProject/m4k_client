// import { Css, addJsFile, addCssFile } from '@common/ui';
// import { setCss } from '@common/ui/css';
// import { PageModel } from '@/api';
// import { DivProps } from '@common/components';
// import { useEffect } from 'preact/hooks';
// import { useGroupMedias } from '@/api/hooks';
// import { MediaConfig, MediaView, MediaViewProps } from './BaseView';

// const c = Css('PageView', {
//   '': {
//     position: 'absolute',
//     overflow: 'hidden',
//     wh: '100%',
//     xy: 0,
//   },
//   HtmlContent: {
//     position: 'absolute',
//     inset: 0,
//     overflow: 'auto',
//   },
//   MediaItem: {
//     position: 'absolute',
//   },
// });

// export type PageViewProps = MediaViewProps<PageModel>;

// export const PageView = ({ media, props }: PageViewProps) => {
//   const allMedias = useGroupMedias();
//   const data = media?.data || {};
//   const { items = [], html, css, jsUrls = [], cssUrls = [] } = data;

//   // Load external resources
//   useEffect(() => {
//     if (css) setCss('PageView-custom', css);
//     jsUrls.forEach((url: string) => addJsFile(url));
//     cssUrls.forEach((url: string) => addCssFile(url));
//   }, [css, jsUrls, cssUrls]);

//   // Helper to find media by ID
//   const getMediaById = (id: string) => allMedias.find((m) => m.id === id);

//   return (
//     <div {...props} class={c(props)}>
//       {/* HTML content */}
//       {html && <div class={c('HtmlContent')} dangerouslySetInnerHTML={{ __html: html }} />}

//       {/* Positioned media items */}
//       {items.map((item: any, index: number) => {
//         const { x = 0, y = 0, w = 100, h = 100, media: mediaId } = item;
//         const mediaItem = getMediaById(mediaId);

//         if (!mediaItem) return null;

//         return (
//           <div
//             key={index}
//             class={c('MediaItem')}
//             style={{
//               left: `${x}%`,
//               top: `${y}%`,
//               width: `${w}%`,
//               height: `${h}%`,
//             }}
//           >
//             <MediaView media={mediaItem} {...props} />
//           </div>
//         );
//       })}
//     </div>
//   );
// };
