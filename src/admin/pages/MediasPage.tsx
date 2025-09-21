import { Css } from '@common/ui';

import { Upload } from 'lucide-react';
import { upload } from '@common/api';
import { tooltip, Page, PageHeader, PageBody, UploadButton } from '@common/components';
import { SearchField } from '../components/SearchField';
import { MediasTable } from '../components/MediasTable';

const css = Css('MediasPage', {
  '&': {},
});

export const MediasPage = () => {
  return (
    <Page cls={css(`Page`)}>
      <PageHeader title="Les medias">
        <UploadButton
          title="Téléverser"
          {...tooltip('Téléverser des medias')}
          icon={<Upload />}
          color="primary"
          onFiles={upload}
        />
        <SearchField />
      </PageHeader>
      <PageBody>
        <MediasTable />
      </PageBody>
    </Page>
  );
};
