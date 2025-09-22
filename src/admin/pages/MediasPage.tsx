import { Css } from '@common/ui';
import { Page, PageBody } from '@common/components';
import { MediasTable } from '../components/MediasTable';

const c = Css('MediasPage', {
  '': {},
});

export const MediasPage = () => {
  return (
    <Page class={c('Page')}>
      <PageBody>
        <MediasTable />
      </PageBody>
    </Page>
  );
};
