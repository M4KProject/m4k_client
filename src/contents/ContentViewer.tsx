import { useAsync, useMsg } from '@common/hooks';
import { Css } from '@common/ui';

import { ContentModel, MediaModel } from '@common/api/models';
import { FormContent } from './FormContent';
import { TableContent } from './TableContent';
import { HtmlContent } from './HtmlContent';
import { PlaylistContent } from './PlaylistContent';
import { JSX } from 'preact';
import { auth$ } from '@common/api/messages';
import { contentCtrl, mediaCtrl } from '@/admin/controllers';

const c = Css('ContentViewer', {
  '': {
    fRow: ['stretch'],
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Roboto, sans-serif',
  },
});

// Content components mapping
export const contentByType: Record<string, (props: ContentProps) => JSX.Element> = {
  form: FormContent,
  table: TableContent,
  html: HtmlContent,
  playlist: PlaylistContent,
};

export interface ContentProps<Model extends ContentModel = ContentModel> {
  content: Model;
  medias: MediaModel[];
}

interface ContentViewerProps {
  contentKey: string;
}

export const ContentViewer = ({ contentKey }: ContentViewerProps) => {
  const auth = useMsg(auth$);
  const authToken = auth?.token || '';

  const [content] = useAsync(null, () => contentCtrl.findKey(contentKey), 'content', [
    authToken,
    contentKey,
  ]);
  const [medias] = useAsync([], () => mediaCtrl.find({}), 'medias', [authToken, contentKey]);

  console.debug('ContentViewer', { auth, content, medias });

  if (!content) {
    return (
      <div class={c('Error')}>
        <h2>Contenu introuvable</h2>
        <p>Le contenu "{contentKey}" n'a pas été trouvé.</p>
      </div>
    );
  }

  const ContentComponent = contentByType[content.type];

  if (!content.data || !ContentComponent) {
    return (
      <div class={c('Error')}>
        <h2>Contenu vide</h2>
        <p>
          Le contenu "{contentKey}" de type "{content.type}" est vide.
        </p>
      </div>
    );
  }

  return <ContentComponent content={content} medias={medias} />;
};
