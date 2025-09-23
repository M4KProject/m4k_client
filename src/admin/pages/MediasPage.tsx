import { Css } from '@common/ui';
import { Page, PageBody } from '@common/components';
import { MediaTable } from '../components/MediaTable';

const c = Css('MediasPage', {});

export const MediasPage = () => {
  return (
    <Page class={c('Page')}>
      <PageBody>
        <MediaTable />
      </PageBody>
    </Page>
  );
};
