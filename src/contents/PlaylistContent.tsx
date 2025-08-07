import type { ContentProps } from './ContentViewer';
import { mediaColl, PlaylistContentModel } from '@common/api';
import { PDFViewer } from './PDFViewer';

export const PlaylistContent = ({ content, medias }: ContentProps<PlaylistContentModel>) => {
  console.debug('PlaylistContent', content, content.data.items);

  // Group items by language
  const itemsByLanguage = content.data.items.reduce((acc, item) => {
    const lang = item.language || 'default';
    if (!acc[lang]) acc[lang] = [];
    acc[lang].push(item);
    return acc;
  }, {} as Record<string, typeof content.data.items>);

  // Get available languages
  const languages = Object.keys(itemsByLanguage);
  
  // Prepare language entries for PDFViewer
  const languageEntries = languages.map(lang => {
    const item = itemsByLanguage[lang][0]; // Take first item for each language
    const mediaId = item.media;
    const media = medias.find(m => m.id === mediaId);
    const mediaUrl = mediaColl.getUrl(mediaId, media.file);
    
    return {
      language: lang,
      url: mediaUrl,
      title: item.title,
      startTime: item.startTime,
      endTime: item.endTime,
      duration: item.duration
    };
  });

  return <PDFViewer languageEntries={languageEntries} />;
};