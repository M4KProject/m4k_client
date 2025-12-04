import { Css } from 'fluxio';
import { useEffect, useMemo } from 'preact/hooks';
import { BViewport } from '@/components/box/edit/BViewport';
import { BSide } from '@/components/box/edit/BSide';
import { useApi } from '@/hooks/useApi';
import { Page } from './base/Page';
import { BMenu } from '../box/edit/BMenu';
import { BEditController } from '../box/edit/BEditController';
import { BContext } from '../box/useBController';
import { useMedia, useRouter } from '@/hooks/useRoute';
import { JobsWindow } from '../panels/Jobs';

const c = Css('EditPage', {
  '': {
    row: 'stretch',
    flex: 1,
  },
});

export const EditPage = () => {
  const api = useApi();
  const router = useRouter();
  const content = useMedia();

  console.debug('EditPage', { content });

  // async load() {
  //   const page = await this.api.media.get(this.playlistKey);
  //   this.log.d('load', this.playlistKey, media);
  //   if (page?.type === 'content') {
  //     this.setAllData(page.data?.boxes || []);
  //   }
  // }

  const controller = useMemo(
    () => new BEditController(api, router),
    [api, router]
  );

  useEffect(() => {
    if (!content) return;
    if (content.type !== "content") {
      router.go({ page: 'medias' });
      return;
    }
    controller.setAllData(content.data?.boxes || [])
  }, [content]);

  return (
    <BContext value={controller}>
      <Page {...c('')} menu={BMenu}>
        <BViewport />
        <JobsWindow />
      </Page>
    </BContext>
  );
};
