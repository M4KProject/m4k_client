import { PageModel } from '@/api';
import { Css } from '@common/ui';
import {
  addItem,
  deepClone,
  moveIndex,
  getPath,
  isDictionary,
  removeItem,
  Dictionary,
} from 'fluxio';
import { Grid } from '@common/components';
import { updateMedia, updatePlaylist } from '@/admin/controllers';
import { JobGrid } from '../jobs/JobGrid';
import { useGroupMedias } from '@/api/hooks';
import { isArray } from 'fluxio';
import { BoxData, BoxDataReadonly } from '@common/box/types';
import { getPbClient } from 'pocketbase-lite';

const c = Css('EditPlaylist', {
  '': {
    fCol: [],
  },
});

const getBoxes = (page: PageModel) => getPath(page, ['data', 'boxes'], {}, isDictionary);

const updateBox = (boxes: Dictionary<BoxData>, id: string, changes: BoxData) => {
  boxes[id] = { ...boxes[id], ...changes };
};

const deleteBox = (boxes: Dictionary<BoxData>, id: string) => {
  Object.values(boxes).forEach((b) => removeItem(b.children, id));
  const item = boxes[id];
  if (item) {
    item.children?.forEach((child) => deleteBox(boxes, child));
    delete boxes[id];
  }
};

export const EditPage = ({ page }: { page: PageModel }) => {
  const medias = useGroupMedias();

  const updateBox = (page: PageModel, id: string, changes: BoxData) =>
    updateMedia<PageModel>(page.id, (page) => {
      const boxes = getBoxes(page);
      boxes[id] = { ...boxes[id], ...changes };
    });

  const deleteBox = (page: PageModel, id: string) =>
    updateMedia<PageModel>(page.id, (page) => {
      const boxes = getBoxes(page);
      Object.values(boxes).forEach((b) => removeItem(b.children, id));
      const item = boxes[id];
      if (item) {
        item.children?.forEach((b) => removeItem(b.children, id));
        delete boxes[id];
      }
    });

  const duplicateItem = (index: number) => {
    updatePlaylist(playlist.id, ({ data }) => {
      if (data && data.items && data.items[index]) {
        const copy = deepClone(data.items[index]);
        addItem(data.items, copy, index + 1);
      }
    });
  };

  const moveItemIndex = (from: number, to: number) => {
    updatePlaylist(playlist.id, ({ data }) => {
      if (data && data.items) {
        moveIndex(data.items, from, to);
      }
    });
  };

  return (
    <div class={c()}>
      <Grid
        cols={playlistCols}
        ctx={{
          updateItem,
          moveItemIndex,
          duplicateItem,
          deleteItem,
          medias,
          playlistId: playlist.id,
        }}
        items={playlist.data?.items || []}
      />
      <JobGrid filter={(job) => job.status !== 'finished'} panel={true} />
    </div>
  );
};
