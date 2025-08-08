import { useCss, useMsg } from '@common/hooks';
import { Css, flexColumn, dateToSeconds, Msg, uniq } from '@common/helpers';
import { Div } from '@common/components';
import { useMemo, useState } from 'preact/hooks';
import type { ContentProps } from './ContentViewer';
import { mediaColl, PlaylistContentModel, PlaylistEntry } from '@common/api';
import { PDFViewer } from './PDFViewer';
import { PlaylistMenu } from './PlaylistMenu';
import { LanguageFlags } from './LanguageFlags';

const css: Css = {
  '&': {
    ...flexColumn({ align: 'stretch' }),
    wMin: '100vw',
    hMin: '100vh',
    position: 'relative',
  },
  '&TopControls': {
    position: 'absolute',
    top: '20px',
    left: '20px',
    right: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 10,
    pointerEvents: 'none',
  },
  '&PDFContainer': {
    flex: 1,
    position: 'relative',
    height: '100vh',
  },
};

// Observables globaux pour la sélection des time slots et langues
export const PlaylistContent = ({ content, medias }: ContentProps<PlaylistContentModel>) => {
  const c = useCss('PlaylistContent', css);
  console.debug('PlaylistContent', content, content.data.items);

  const selected$ = useMemo(() => new Msg<PlaylistEntry|null>(null), []);
  const language$ = useMemo(() => new Msg(''), []);

  console.debug('PlaylistContent msg', { selected$, language$ })

  const selected = useMsg(selected$);
  const language = useMsg(language$);
  const time = dateToSeconds();

  console.debug('PlaylistContent values', { selected, language, time })

  const items = content.data.items;
  const filteredItems = items.filter(i => i.language === (language || 'fr'));
  const timeItems = filteredItems.filter(i => i.startTime <= time && i.endTime >= time);
  const currentItem = selected || timeItems[0] || filteredItems[0] || items[0];

  console.debug('PlaylistContent filter', { items, filteredItems, currentItem });

  const mediaId = currentItem.media;
  const media = medias.find(m => m.id === mediaId);
  const mediaUrl = media && mediaColl.getUrl(mediaId, media.file);

  console.debug('PlaylistContent media', { mediaId, media, mediaUrl });

  const languages = uniq(items.map(item => item.language));

  console.debug('PlaylistContent media', { mediaId, media, mediaUrl });

  return (
    <Div cls={`${c}`}>
      <Div cls={`${c}TopControls`}>
        <PlaylistMenu items={filteredItems.map(item => [item, item.title])} msg={selected$} />
        <LanguageFlags languages={languages} language$={language$} />
      </Div>
      
      {mediaUrl && (
        <Div cls={`${c}PDFContainer`}>
          <PDFViewer url={mediaUrl} />
        </Div>
      )}
    </Div>
  );
};