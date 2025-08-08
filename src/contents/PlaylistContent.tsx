import { useCss, useMsg } from '@common/hooks';
import { Css, flexColumn, dateToSeconds, Msg, uniq } from '@common/helpers';
import { Div } from '@common/components';
import { useMemo, useState } from 'preact/hooks';
import type { ContentProps } from './ContentViewer';
import { mediaColl, PlaylistContentModel } from '@common/api';
import { PDFViewer } from './PDFViewer';
import { TimeSlotSelector } from './TimeSlotSelector';
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

  const selectedTime$ = useMemo(() => new Msg(0), []);
  const language$ = useMemo(() => new Msg(''), []);

  console.debug('PlaylistContent msg', { selectedTime$, language$ })

  const selectedTime = useMsg(selectedTime$);
  const language = useMsg(language$);

  const time = selectedTime || dateToSeconds();

  console.debug('PlaylistContent values', { selectedTime, language, time })

  const items = content.data.items;
  const timeItems = items.filter(i => i.startTime <= time && time <= i.endTime);
  const languageItems = timeItems.filter(i => i.language === language);
  const currentItem = languageItems[0] || timeItems[0] || items[0];

  console.debug('PlaylistContent filter', { items, timeItems, languageItems, currentItem });

  const mediaId = currentItem.media;
  const media = medias.find(m => m.id === mediaId);
  const mediaUrl = media && mediaColl.getUrl(mediaId, media.file);

  console.debug('PlaylistContent media', { mediaId, media, mediaUrl });

  const times = uniq(items.map(item => item.startTime));
  const languages = uniq(items.map(item => item.language));

  console.debug('PlaylistContent media', { mediaId, media, mediaUrl });

  return (
    <Div cls={`${c}`}>
      <Div cls={`${c}TopControls`}>
        <TimeSlotSelector times={times} selectedTime$={selectedTime$} />
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