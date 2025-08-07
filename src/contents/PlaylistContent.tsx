import type { ContentProps } from './ContentViewer';
import { mediaColl, PlaylistContentModel } from '@common/api';
import { PDFViewer } from './PDFViewer';

export const PlaylistContent = ({ content, medias }: ContentProps<PlaylistContentModel>) => {
  console.debug('PlaylistContent', content, content.data.items[0].media);

  const mediaId = content.data.items[0].media;
  const media = medias.find(m => m.id === mediaId);
  const mediaUrl = mediaColl.getUrl(mediaId, media.file);
  
  // const item = content.data.items[0];
  
  return <PDFViewer url={mediaUrl} />;
};