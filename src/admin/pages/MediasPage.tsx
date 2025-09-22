import { Css } from '@common/ui';

import { Upload } from 'lucide-react';
import { upload } from '@common/api';
import { tooltip, Page, Toolbar, PageBody, UploadButton } from '@common/components';
import { SearchField } from '../components/SearchField';
import { MediasTable } from '../components/MediasTable';

const c = Css('MediasPage', {
  '': {},
});

export const MediasPage = () => {
  return (
    <Page class={c('Page')}>
      <Toolbar title="Les medias">
        <UploadButton
          title="Téléverser"
          {...tooltip('Téléverser des medias')}
          icon={<Upload />}
          color="primary"
          onFiles={upload}
        />
        <SearchField />
      </Toolbar>
      <PageBody>
        <MediasTable />
      </PageBody>
    </Page>
  );
};
