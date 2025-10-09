// import { Css } from '@common/ui';
// import { PdfModel } from '@common/api';
// import { DivProps, Button } from '@common/components';
// import { groupBy, sortItems } from '@common/utils';
// import { useState } from 'preact/hooks';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { MediaConfig, MediaViewProps } from './BaseView';
// import { getVariants } from '@/api/getVariants';
// import { getMediaUrl } from '@/api/getMediaUrl';

// const c = Css('PdfView', {
//   '': {
//     position: 'absolute',
//     overflow: 'hidden',
//     fCenter: 1,
//     wh: '100%',
//     xy: 0,
//   },
//   Container: {
//     position: 'absolute',
//     inset: 0,
//     overflow: 'auto',
//     textAlign: 'center',
//     bg: '#f5f5f5',
//     paddingBottom: '80px',
//   },
//   Page: {
//     wh: '100%',
//     bgMode: 'contain',
//     bgPosition: 'center',
//     bgRepeat: 'no-repeat',
//     minHeight: '100vh',
//   },
//   Toolbar: {
//     position: 'absolute',
//     bottom: '20px',
//     left: '50%',
//     transform: 'translateX(-50%)',
//     fRow: ['center'],
//     gap: '1rem',
//     zIndex: 10,
//     bg: 'rgba(255, 255, 255, 0.9)',
//     p: '10px',
//     rounded: '8px',
//     elevation: 2,
//   },
//   PageInfo: {
//     bold: 1,
//     fg: '#333',
//     px: '10px',
//     whiteSpace: 'nowrap',
//   },
// });

// export type PdfViewProps = MediaViewProps<PdfModel>;

// export const PdfView = ({ media, ...props }: PdfViewProps) => {
//   const [currentPage, setCurrentPage] = useState(0);

//   const variants = getVariants(media);
//   const images = variants.filter((v) => v.type === 'image');
//   const imagesByPage = groupBy(images, (i) => i.page);
//   const pages = sortItems(Object.keys(imagesByPage), Number);
//   const totalPages = pages.length;

//   if (!media || totalPages === 0) return null;

//   const currentPageKey = pages[currentPage];
//   const currentImage = imagesByPage[currentPageKey]?.[0];

//   const handlePreviousPage = () => {
//     if (currentPage > 0) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const handleNextPage = () => {
//     if (currentPage < totalPages - 1) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   return (
//     <div {...props} class={c(props)}>
//       <div class={c('Container')}>
//         {currentImage && (
//           <div
//             class={c('Page')}
//             style={{
//               backgroundImage: `url('${getMediaUrl(currentImage)}')`,
//             }}
//           />
//         )}
//       </div>

//       <div class={c('Toolbar')}>
//         <Button
//           icon={<ChevronLeft />}
//           color={currentPage <= 0 ? 'secondary' : 'primary'}
//           onClick={currentPage <= 0 ? undefined : handlePreviousPage}
//         />
//         <div class={c('PageInfo')}>
//           {currentPage + 1} / {totalPages}
//         </div>
//         <Button
//           icon={<ChevronRight />}
//           color={currentPage >= totalPages - 1 ? 'secondary' : 'primary'}
//           onClick={currentPage >= totalPages - 1 ? undefined : handleNextPage}
//         />
//       </div>
//     </div>
//   );
// };
