import { useCss, useMsg } from '@common/hooks';
import { Css, flexColumn, dateToSeconds, Msg, uniq } from '@common/helpers';
import { Div, Field, Flag } from '@common/components';
import { useEffect, useMemo } from 'preact/hooks';
import type { ContentProps } from './ContentViewer';
import { mediaColl, PlaylistContentModel, PlaylistEntry } from '@common/api';
import { PDFViewer } from './PDFViewer';

const css: Css = {
  '&': {
    ...flexColumn({ align: 'stretch' }),
    wMin: '100vw',
    hMin: '100vh',
    position: 'relative',
  },
  '&ItemSelect': {
    position: 'absolute',
    t: 1,
    l: 1,
    zIndex: 10,
  },
  '&LanguageSelect': {
    position: 'absolute',
    t: 1,
    r: 1,
    zIndex: 10,
  },
  '&LanguageSelect .Button': {
    fontSize: '3rem',
    bg: '#7a624a',
  },
  '&PDFContainer': {
    flex: 1,
    position: 'relative',
    height: '100vh',
  },
  '& .SelectDropdown': {
    bg: '#ffffff80',
  }
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

  const items = content.data.items;
  const filteredItems = items.filter(i => i.language === (language || 'fr'));

  useEffect(() => {
    if (selected) {
      if (!filteredItems.find(item => item === selected)) {
        selected$.set(null);
      }
      return;
    }
    
    const time = dateToSeconds();
    console.debug('PlaylistContent time', time);

    const timeItems = filteredItems.filter(i => i.startTime <= time && i.endTime >= time);
    console.debug('PlaylistContent timeItems', timeItems);

    const first = timeItems[0];
    if (first) {
      selected$.set(first);
    }
  }, [selected, items, language]);

  console.debug('PlaylistContent values', { selected, language })

  // const timeItems = filteredItems.filter(i => i.startTime <= time && i.endTime >= time);
  // const currentItem = selected || filteredItems[0] || items[0];

  console.debug('PlaylistContent filter', { items, filteredItems, selected });

  const mediaId = selected?.media;
  const media = mediaId ? medias.find(m => m.id === mediaId) : null;
  const mediaUrl = media ? mediaColl.getUrl(mediaId, media.file) : null;

  console.debug('PlaylistContent media', { mediaId, media, mediaUrl });

  const languages = uniq(items.map(item => item.language));

  console.debug('PlaylistContent media', { mediaId, media, mediaUrl });

  return (
    <Div cls={`${c}`}>
      <Div cls={`${c}ItemSelect`} >
        <Field type="select" items={filteredItems.map(item => [item, item.title])} msg={selected$} />
      </Div>
      <Div cls={`${c}LanguageSelect`}>
        <Field type="picker" items={languages.map(iso => [iso, <Flag iso={iso} />])} msg={language$} />
      </Div>

      {mediaUrl && (
        <Div cls={`${c}PDFContainer`}>
          <PDFViewer url={mediaUrl} />
        </Div>
      )}
    </Div>
  );
};