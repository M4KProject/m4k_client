import { Css } from '@common/ui';
import { Page, PageBody } from '@common/components';
import { MediaTable } from '../components/MediaTable';
import { useMsg } from '@common/hooks';
import { mediaId$ } from '../messages';
import { mediaCtrl } from '@/colls';

const c = Css('PlaylistsPage', {});

export const PlaylistsPage = () => {
  const id = useMsg(mediaId$);
  const playlist = useMsg(mediaCtrl.one$({ id, type: 'playlist' }));

  return (
    <Page class={c('Page')}>
      <PageBody>
        <MediaTable type="playlist" />
      </PageBody>
    </Page>
  );
};
