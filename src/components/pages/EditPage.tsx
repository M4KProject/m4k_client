import { Css } from 'fluxio';
import { JobGrid } from '@/components/admin/JobGrid';
import { useMemo } from 'preact/hooks';
import { BViewport } from '@/components/box/edit/BViewport';
import { BSide } from '@/components/box/edit/BSide';
import { useApi } from '@/hooks/useApi';
import { Page } from './base/Page';
import { useMediaKey } from '@/router';
import { BMenu } from '../box/edit/BMenu';
import { BEditController } from '../box/edit/BEditController';
import { BContext } from '../box/useBController';
import { useRouter } from '@/hooks/useRoute';

const c = Css('EditPage', {
  '': {
    row: 'stretch',
    flex: 1,
  },
});

export const EditPage = () => {
  const api = useApi();
  const router = useRouter();
  const playlistKey = useMediaKey();
  const controller = useMemo(() => new BEditController(api, router, playlistKey), [api, router, playlistKey]);

  return (
    <BContext value={controller}>
      <Page {...c('')} menu={BMenu}>
        <BSide />
        <BViewport />
        <JobGrid filter={(job) => job.status !== 'finished'} panel={true} />
      </Page>
    </BContext>
  );
};
