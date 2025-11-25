import { Css } from 'fluxio';
import { JobGrid } from '@/components/admin/JobGrid';
import { useMemo } from 'preact/hooks';
import { BContext, BController } from '@/components/box/BController';
import { BViewport } from '@/components/box/edit/BViewport';
import { BSide } from '@/components/box/edit/BSide';
import { useApi } from '@/hooks/useApi';
import { Page } from './base/Page';
import { useMediaKey } from '@/router';

const c = Css('EditPage', {
  '': {
    row: 'stretch',
    flex: 1,
  },
});

export const EditPage = () => {
  const api = useApi();
  const playlistKey = useMediaKey();
  const ctrl = useMemo(() => new BController(api, playlistKey), [api, playlistKey]);

  return (
    <Page title="Edition" {...c()}>
      <BContext value={ctrl}>
        <BViewport />
        <BSide />
      </BContext>
      <JobGrid filter={(job) => job.status !== 'finished'} panel={true} />
    </Page>
  );
};
