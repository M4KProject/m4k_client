import { Css } from '@common/ui';
import { Page, PageBody } from '@common/components';
import { MediaTable } from '../components/MediaTable';

const c = Css('ImagesPage', {});

export const ImagesPage = () => {
  return (
    <Page class={c('Page')}>
      <PageBody>
        <MediaTable type="image" />
      </PageBody>
    </Page>
  );
};
