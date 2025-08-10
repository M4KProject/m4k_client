import { useAsync, useCss, useMsg } from '@common/hooks';
import { Css, flexColumn } from '@common/helpers';
import { Div } from '@common/components';
import { auth$, contentColl, ContentModel, mediaColl, MediaModel } from '@common/api';
import { FormContent } from './FormContent';
import { TableContent } from './TableContent';
import { HtmlContent } from './HtmlContent';
import { PlaylistContent } from './PlaylistContent';
import { JSX } from 'preact';

const css: Css = {
  '&': {
    ...flexColumn({ align: 'stretch' }),
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Roboto, sans-serif',
  },
};

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
  const c = useCss('ContentViewer', css);

  const auth = useMsg(auth$);
  const authToken = auth?.token || '';

  const [content] = useAsync(null, () => contentColl.findKey(contentKey), "content", [authToken, contentKey]);
  const [medias] = useAsync([], () => mediaColl.find({}), "medias", [authToken, contentKey]);

  if (!content) {
    return (
      <Div cls={`${c}Error`}>
        <h2>Contenu introuvable</h2>
        <p>Le contenu "{contentKey}" n'a pas été trouvé.</p>
      </Div>
    );
  }

  const ContentComponent = contentByType[content.type];

  if (!content.data || !ContentComponent) {
    return (
      <Div cls={`${c}Error`}>
        <h2>Contenu vide</h2>
        <p>Le contenu "{contentKey}" de type "{content.type}" est vide.</p>
      </Div>
    );
  }

  return (
    <ContentComponent content={content} medias={medias} />
  );
};