import { Css } from 'fluxio';
import { JobGrid } from '@/components/admin/JobGrid';
import { useEffect, useMemo } from 'preact/hooks';
import { BContext, BController } from '@/components/box/BController';
import { PageModel } from '@/api/models';
import { sideOpen$ } from '@/components/common/Side';
import { BViewport } from '@/components/box/edit/BViewport';
import { BSide } from '@/components/box/edit/BSide';
import { useApi } from '@/hooks/apiHooks';
import { Page } from '@/components/common/Page';
import { useMediaKey } from '@/router';

const c = Css('EditPlaylistPage', {
  '': {
    row: 'stretch',
    flex: 1,
  },
});

export const EditPlaylistPage = () => {
  const api = useApi();
  const playlistKey = useMediaKey();
  const ctrl = useMemo(() => new BController(api, playlistKey), [api, playlistKey]);

  useEffect(() => {
    sideOpen$.set(false);
    return () => {
      sideOpen$.set(true);
    };
  }, []);

  return (
    <Page {...c()}>
      <BContext value={ctrl}>
        <BViewport />
        <BSide />
      </BContext>
      <JobGrid filter={(job) => job.status !== 'finished'} panel={true} />
    </Page>
  );
};
