import { Css } from '@common/helpers';
import { useCss } from '@common/hooks';
import { contentColl, ContentModel } from '@common/api';
import { Button } from '@common/components';
import { MdSync } from "react-icons/md";
import { Page, PageHeader, PageBody } from '@common/components';
import { SearchField } from '../components/SearchField';
import { FormContent } from './Content/FormContent';
import { TableContent } from './Content/TableContent';
import { HtmlContent } from './Content/HtmlContent';
import { ContentProps } from './Content/ContentProps';
import { JSX } from 'preact';
import { useMsg } from '@common/hooks';
import { Loading } from '@common/components';
import { PlaylistContent } from './Content/PlaylistContent';
import { content$ } from '../controllers';
import { EmptyContent } from './Content/EmptyContent';
import { HiboutikContent } from './Content/HiboutikContent';

const css: Css = {};

export const contentByType: Record<string, [string, (props: ContentProps) => JSX.Element]> = {
    empty: ["", EmptyContent],
    form: ["Formulaire", FormContent],
    table: ["Tableau", TableContent],
    html: ["HTML", HtmlContent],
    playlist: ["Playlist", PlaylistContent],
    hiboutik: ["Hiboutik", HiboutikContent],
}

export const ContentPage = () => {
    const c = useCss('ContentPage', css);
    // const auth = useMsg(auth$);
    const content = useMsg(content$);

    if (!content) return <Loading />;

    const id = content.id;
    const type = content.type || "empty";
    const title = content.title;
    const data = content.data || {};

    const [label, Content] = contentByType[type] || contentByType.empty;

    const updateContent = async (changes: Partial<ContentModel>) => {
        const contentUpdated = await contentColl.update(id, changes);
        content$.set(contentUpdated);
    }

    const updateData = async (changes: Partial<ContentModel["data"]>) => {
        await updateContent({ data: { ...data, ...changes } });
    }

    return (
        <Page cls={c}>
            <PageHeader title={`${label}: ${title}`}>
                <Button title="Rafraîchir" icon={<MdSync />} color="primary" onClick={() => content$.signal()} />
                <SearchField />
            </PageHeader>
            <PageBody>
                <Content
                    content={content}
                    data={content.data||{}}
                    updateContent={updateContent}
                    updateData={updateData}
                />
            </PageBody>
        </Page>
    );
}
