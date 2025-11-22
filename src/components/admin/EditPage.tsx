import { Css } from 'fluxio';
import { JobGrid } from '@/components/admin/JobGrid';
import { useEffect, useMemo } from 'preact/hooks';
import { BContext, BCtrl } from '@/components/box/BCtrl';
import { PageModel } from '@/api/models';
import { sideOpen$ } from '@/components/Side';
import { BViewport } from '@/components/box/edit/BViewport';
import { BSide } from '@/components/box/edit/BSide';
import { useApi } from '@/hooks/apiHooks';

const c = Css('EditPage', {
  '': {
    row: 'stretch',
    flex: 1,
  },
});

export const EditPage = ({ page }: { page: PageModel }) => {
  const api = useApi();
  const ctrl = useMemo(() => new BCtrl(api, page.id), [api, page.id]);

  useEffect(() => {
    sideOpen$.set(false);
    return () => {
      sideOpen$.set(true);
    };
  }, []);

  return (
    <div {...c()}>
      <BContext.Provider value={ctrl}>
        <BViewport />
        <BSide />
      </BContext.Provider>
      <JobGrid filter={(job) => job.status !== 'finished'} panel={true} />
    </div>
  );
};
