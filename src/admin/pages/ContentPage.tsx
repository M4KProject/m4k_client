import { Css } from '@common/ui';

import { Button } from '@common/components';
import { RefreshCw } from 'lucide-react';
import { Page, PageHeader, PageBody } from '@common/components';
import { SearchField } from '../components/SearchField';
import { FormContent } from './Content/FormContent';
import { TableContent } from './Content/TableContent';
import { HtmlContent } from './Content/HtmlContent';
import { ContentProps } from './Content/ContentProps';
import { JSX } from 'preact';
import { Loading } from '@common/components';
import { PlaylistContent } from './Content/PlaylistContent';
import { EmptyContent } from './Content/EmptyContent';
import { HiboutikContent } from './Content/HiboutikContent';
import { coll, ContentModel } from '@common/api';

const css = Css('ContentPage', {});

export const contentByType: Record<string, [string, (props: ContentProps) => JSX.Element]> = {
  empty: ['', EmptyContent],
  form: ['Formulaire', FormContent],
  table: ['Tableau', TableContent],
  html: ['HTML', HtmlContent],
  playlist: ['Playlist', PlaylistContent],
  hiboutik: ['Hiboutik', HiboutikContent],
};

export const ContentPage = () => {
  // const auth = useMsg(auth$);
  const content = null as any; // useMsg(content$);

  if (!content) return <Loading />;

  const id = content.id;
  const type = content.type || 'empty';
  const title = content.title;
  const data = content.data || {};

  const [label, Content] = contentByType[type] || contentByType.empty;

  const updateContent = async (changes: Partial<ContentModel>) => {
    const contentUpdated = await coll('contents').update(id, changes);
    // content$.set(contentUpdated);
  };

  const updateData = async (changes: Partial<ContentModel['data']>) => {
    await updateContent({ data: { ...data, ...changes } });
  };

  return (
    <Page  cls={css()}>
      <PageHeader title={`${label}: ${title}`}>
        <Button
          title="Rafraîchir"
          icon={<RefreshCw />}
          color="primary"
          onClick={() => {
            // content$.signal()
          }}
        />
        <SearchField />
      </PageHeader>
      <PageBody>
        <Content
          content={content}
          data={content.data || {}}
          updateContent={updateContent}
          updateData={updateData}
        />
      </PageBody>
    </Page>
  );
};
