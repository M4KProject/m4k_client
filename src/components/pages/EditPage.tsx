import { Css } from 'fluxio';
import { useEffect, useMemo } from 'preact/hooks';
import { BViewport } from '@/components/box/edit/BViewport';
import { useApi } from '@/hooks/useApi';
import { Page } from './base/Page';
import { BMenu } from '../box/edit/BMenu';
import { BEditController } from '../box/edit/BEditController';
import { BContext } from '../box/useBController';
import { useMedia, useRouter } from '@/hooks/useRoute';
import { JobsWindow } from '../panels/Jobs';
import { useMediaController } from '@/hooks/useMediaController';

const c = Css('EditPage', {
  '': {
    row: 'stretch',
    flex: 1,
    alignContent: 'stretch',
  },
});

export const EditPage = () => {
  const api = useApi();
  const router = useRouter();
  const content = useMedia();
  const mediaController = useMediaController();

  console.debug('EditPage', { content });

  // async load() {
  //   const page = await this.api.media.get(this.playlistKey);
  //   this.log.d('load', this.playlistKey, media);
  //   if (page?.type === 'content') {
  //     this.setAllData(page.data?.boxes || []);
  //   }
  // }

  const controller = useMemo(
    () => new BEditController(api, router, mediaController),
    [api, router, mediaController]
  );

  useEffect(() => {
    if (!content) return;

    if (content.type !== 'content') {
      router.go({ page: 'medias' });
      return;
    }

    controller.setAllData(content.data?.boxes || []);

    controller.onSave = async () => {
      const boxes = controller.getAllData();
      console.debug('EditPage save', boxes);
      await api.media.update(content.id, {
        data: { boxes },
      });
    };
  }, [content]);

  useEffect(() => {
    const refresh = () => {
      const [width, height] = router.screenSize$.get();
      console.debug('EditPage screenSize', width, height);
      controller.panZoom.setSize(width, height);
      controller.panZoomFit();
    };
    refresh();
    return router.screenSize$.on(refresh);
  }, [router]);

  return (
    <BContext value={controller}>
      <Page {...c('')} menu={false}>
        <BViewport />
        <JobsWindow />
      </Page>
    </BContext>
  );
};
