import { Css } from '@common/ui';
import { Page, PageBody, Toolbar } from '@common/components';
import { MediaTable } from '../components/medias/MediaTable';
import { NewFolderButton } from '../components/medias/NewFolderButton';
import { UploadMediaButton } from '../components/medias/UploadMediaButton';
import { SearchField } from '../components/SearchField';

const c = Css('MediasPage', {});

export const MediasPage = () => {
  return (
    <Page class={c('Page')}>
      <Toolbar title="Medias">
        <NewFolderButton />
        <UploadMediaButton />
        <SearchField />
      </Toolbar>
      <PageBody>
        <MediaTable />
      </PageBody>
    </Page>
  );
};
