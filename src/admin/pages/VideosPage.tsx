import { Css } from '@common/ui';
import { Page, PageBody, Toolbar } from '@common/components';
import { MediaTable } from '../components/MediaTable';
import { UploadMediaButton } from '../components/UploadMediaButton';
import { SearchField } from '../components/SearchField';

const c = Css('ImagesPage', {});

export const VideosPage = () => {
  return (
    <Page class={c('Page')}>
      <Toolbar title="Videos">
        <UploadMediaButton />
        <SearchField />
      </Toolbar>
      <PageBody>
        <MediaTable type="video" />
      </PageBody>
    </Page>
  );
};
