import { Css } from '@common/ui';
import { Page, PageBody, Toolbar } from '@common/components';
import { MediaTable } from '../components/medias/MediaTable';
import { UploadMediaButton } from '../components/medias/UploadMediaButton';
import { SearchField } from '../components/SearchField';

const c = Css('ImagesPage', {});

export const ImagesPage = () => {
  return (
    <Page class={c('Page')}>
      <Toolbar title="Images">
        <UploadMediaButton />
        <SearchField />
      </Toolbar>
      <PageBody>
        <MediaTable type="image" />
      </PageBody>
    </Page>
  );
};
