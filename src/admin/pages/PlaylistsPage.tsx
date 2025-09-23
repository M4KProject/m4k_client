import { Css } from '@common/ui';
import { Page, PageBody } from '@common/components';
import { MediaTable } from '../components/MediaTable';

const c = Css('PlaylistsPage', {});

export const PlaylistsPage = () => {
  return (
    <Page class={c('Page')}>
      <PageBody>
        <MediaTable type="playlist" />
      </PageBody>
    </Page>
  );
};
