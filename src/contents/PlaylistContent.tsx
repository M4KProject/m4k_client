import { useMsg } from '@common/hooks';
import { Css, flexColumn } from '@common/ui';
import { dateToSeconds, Msg, uniq, toList } from '@common/utils';
import { Div, Field, Flag } from '@common/components';
import { useEffect, useMemo } from 'preact/hooks';
import type { ContentProps } from './ContentViewer';
import { PlaylistContentModel, PlaylistEntry } from '@common/api';
import { PDFViewer } from './PDFViewer';
import { mediaCtrl } from '@/admin/controllers';

const css = Css('PlaylistContent', {
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
  },
  '&PDFContainer': {
    flex: 1,
    position: 'relative',
    height: '100vh',
  },
  '& .Button-secondary': {
    bg: '#7a624a',
  },
  '& .Button-primary': {
    bg: '#7a624a',
  },
  '& .SelectDropdown': {
    bg: '#ffffff80',
  },
  '& .Button-secondary:hover .ButtonIcon': {
    bg: '#ffffffaa',
  },
  '& .Button-primary:hover .ButtonIcon': {
    bg: '#ffffffaa',
  },
  '& .SelectOption-selected': {
    fg: '#7a624a',
    bg: '#efefef',
  },
});

// Observables globaux pour la sélection des time slots et langues
export const PlaylistContent = ({ content, medias }: ContentProps<PlaylistContentModel>) => {
  console.debug('PlaylistContent', content, content.data.items);

  const selected$ = useMemo(() => new Msg<PlaylistEntry | null>(null), []);
  const language$ = useMemo(() => new Msg(''), []);

  console.debug('PlaylistContent msg', { selected$, language$ });

  const selected = useMsg(selected$);
  const language = useMsg(language$);

  const items = content.data.items;
  const filteredItems = items.filter((i) => i.language === (language || 'fr'));

  useEffect(() => {
    if (selected) {
      if (!filteredItems.find((item) => item === selected)) {
        selected$.set(null);
      }
      return;
    }

    const time = dateToSeconds();
    console.debug('PlaylistContent time', time);

    const timeItems = filteredItems.filter((i) => i.startTime <= time && i.endTime >= time);
    console.debug('PlaylistContent timeItems', timeItems);

    const first = timeItems[0];
    if (first) {
      selected$.set(first);
    }
  }, [selected, items, language]);

  console.debug('PlaylistContent values', { selected, language });

  // const timeItems = filteredItems.filter(i => i.startTime <= time && i.endTime >= time);
  // const currentItem = selected || filteredItems[0] || items[0];

  console.debug('PlaylistContent filter', { items, filteredItems, selected, medias });

  const mediaId = selected?.media;
  const media = mediaId ? toList(medias).find((m) => m.id === mediaId) : null;
  const mediaUrl = media ? mediaCtrl.getUrl(mediaId, media.source) : null;

  console.debug('PlaylistContent media', { mediaId, medias, media, mediaUrl });

  const languages = uniq(items.map((item) => item.language));

  // Détermine si les boutons doivent être visibles
  const hasMedia = !!mediaUrl;

  console.debug('PlaylistContent visibility', { hasMedia });

  return (
    <Div cls={css()}>
      <Div cls={css(`ItemSelect ${hasMedia ? '' : 'autoHide'}`)}>
        <Field
          type="select"
          items={filteredItems.map((item) => [item, item.title])}
          msg={selected$}
        />
      </Div>
      <Div cls={css(`LanguageSelect ${hasMedia ? '' : 'autoHide'}`)}>
        <Field
          type="picker"
          items={languages.map((iso) => [iso, <Flag iso={iso} />])}
          msg={language$}
        />
      </Div>

      {mediaUrl && (
        <Div cls={css(`PDFContainer`)}>
          <PDFViewer url={mediaUrl} />
        </Div>
      )}
    </Div>
  );
};
