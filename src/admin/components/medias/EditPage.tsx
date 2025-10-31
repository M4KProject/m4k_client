// import { PageModel } from '@/api';
// import { Css } from '@common/ui';
// import {
//   addItem,
//   deepClone,
//   moveIndex,
//   getPath,
//   isDictionary,
//   removeItem,
//   Dictionary,
// } from 'fluxio';
// import { Grid } from '@common/components';
// import { updateMedia, updatePlaylist } from '@/admin/controllers';
// import { JobGrid } from '../jobs/JobGrid';
// import { useGroupMedias } from '@/api/hooks';
// import { isArray } from 'fluxio';
// import { BoxData, Boxes } from '@common/box/types';
// import { getPbClient } from 'pocketbase-lite';

// const c = Css('EditPlaylist', {
//   '': {
//     fCol: [],
//   },
// });

// const getBoxes = (page: PageModel) => getPath(page, ['data', 'boxes'], {}, isDictionary);

// const cleanBoxes = (boxes: Dictionary<BoxData>) => {
//   // clean children
//   Object.entries(boxes).forEach(([key, data]) => {
//     const prev = data.childIds;
//     if (prev) {
//       const next = prev.filter(id => boxes[id]);
//       if (next.length !== prev.length) {
//         boxes[key] = { ...data, childIds: next };
//       }
//     }
//   });
// }

// const updateBoxData = (boxes: Boxes, id: string, changes: BoxData) => {
//   boxes[id] = { ...boxes[id], ...changes };
// };

// const deleteBoxData = (boxes: Dictionary<BoxData>, id: string) => {
//   delete boxes[id];
// };

// export const EditPage = ({ page }: { page: PageModel }) => {
//   const medias = useGroupMedias();

//   const updateBoxes = (apply: (boxes: Dictionary<BoxData>, page: PageModel) => void) => (
//     updateMedia<PageModel>(page.id, (page) => {
//       const boxes = getBoxes(page);
//       apply(boxes, page);
//       cleanBoxes(boxes);
//     })
//   );

//   const updateBox = (id: string, changes: BoxData) => (
//     updateBoxes(boxes => {
//       boxes[id] = { ...boxes[id], ...changes };
//     })
//   )

//   const deleteBox = (id: string) => (
//     updateBoxes(boxes => {
//       delete boxes[id];
//     })
//   )

//   return (
//     <div class={c()}>
//       <Grid
//         cols={playlistCols}
//         ctx={{
//           updateItem,
//           moveItemIndex,
//           duplicateItem,
//           deleteItem,
//           medias,
//           playlistId: playlist.id,
//         }}
//         items={playlist.data?.items || []}
//       />
//       <JobGrid filter={(job) => job.status !== 'finished'} panel={true} />
//     </div>
//   );
// };
