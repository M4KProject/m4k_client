import { useAsync, useCss } from '@common/hooks';
import { Css, flexColumn } from '@common/helpers';
import { Div } from '@common/components';
import { contentColl, ContentModel } from '@common/api';
import { useState, useEffect } from 'preact/hooks';
import { FormContent } from './FormContent';
import { TableContent } from './TableContent';
import { HtmlContent } from './HtmlContent';
import { PlaylistContent } from './PlaylistContent';
import { EmptyContent } from './EmptyContent';
import { HiboutikContent } from './HiboutikContent';
import { JSX } from 'preact';

const css: Css = {
  '&': {
    ...flexColumn({ align: 'stretch' }),
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Roboto, sans-serif',
  },
  '&Loading': {
    ...flexColumn({ align: 'center', justify: 'center' }),
    minHeight: '100vh',
    fontSize: 1.5,
    color: '#666',
  }
};

// Content components mapping
export const contentByType: Record<string, (props: ContentProps) => JSX.Element> = {
  empty: EmptyContent,
  form: FormContent,
  table: TableContent,
  html: HtmlContent,
  playlist: PlaylistContent,
  hiboutik: HiboutikContent,
};

export interface ContentProps<Model extends ContentModel = ContentModel> {
  content: Model;
  data: Model['data'];
}

interface ContentViewerProps {
  contentKey: string;
}

export const ContentViewer = ({ contentKey }: ContentViewerProps) => {
  const c = useCss('ContentViewer', css);

  const [content, contentRefresh] = useAsync(null, () => contentColl.findKey(contentKey), "content", [contentKey]);

  if (!content) {
    return (
      <Div cls={`${c} ${c}Error`}>
        <h2>Contenu introuvable</h2>
        <p>Le contenu "{contentKey}" n'a pas été trouvé.</p>
      </Div>
    );
  }

  const type = content.type || "empty";
  const data = content.data || {};
  
  const ContentComponent = contentByType[type] || contentByType.empty;

  return (
    <Div cls={`${c}`}>
      <ContentComponent 
        content={content}
        data={data}
      />
    </Div>
  );
};