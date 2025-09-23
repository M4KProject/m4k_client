import { Css } from '@common/ui';
import { byId, firstUpper, groupBy } from '@common/utils';
import { addTr, useMsg } from '@common/hooks';
import { isAdvanced$, selectedById$ } from '../messages';
import { FolderPlus, MapPlus, Upload } from 'lucide-react';
import { needAuthId, needGroupId, MediaModel, upload } from '@common/api';
import {
  tooltip,
  Button,
  Table,
  Row,
  CellHeader,
  TableHead,
  TableBody,
  Toolbar,
  UploadButton,
} from '@common/components';
import { JobsTable } from './JobsTable';
import { SearchField } from './SearchField';
import { useGroupQuery } from '@common/hooks/useQuery';
import { mediaCtrl } from '../controllers';
import { MediaCtx, MediaRow } from './MediaRow';
import { NewFolderButton } from './NewFolderButton';
import { getNextTitle } from '../controllers/getNextTitle';
import { NewPlaylistButton } from './NewPlaylistButton';
import { UploadMediaButton } from './UploadMediaButton';

addTr({
  pending: 'en attente',
  uploading: 'téléchargement',
  processing: 'traitement',
  failed: 'échec',
  success: 'succès',
});

const c = Css('Media', {
  '-uploading': { fg: 'primary' },
  '-processing': { fg: 'secondary' },
  '-failed': { fg: 'error' },
  '-success': { fg: 'success' },

  Jobs: {
    position: 'fixed',
    r: 1,
    b: 1,
    w: 40,
  },
});

// export const MediasProgress = () => {
//   const items = Object.values(useMsg(uploadItems$));

//   if (items.length === 0) {
//     return null;
//   }

//   return (
//     <Table>
//       <TableHead>
//         <Row>
//           <CellHeader>Nom</CellHeader>
//           <CellHeader>Etat</CellHeader>
//           <CellHeader>Progression</CellHeader>
//         </Row>
//       </TableHead>
//       <TableBody>
//         {items.map((m) => (
//           <Row key={m.id}>
//             <Cell>{m.name}</Cell>
//             <Cell class={c('-${m.status}')}>
//               <Tr>{m.status}</Tr>
//             </Cell>
//             <Cell>
//               <Progress progress={m.progress} />
//             </Cell>
//           </Row>
//         ))}
//       </TableBody>
//     </Table>
//   );
// };

export const MediaTable = ({ type }: { type?: MediaModel['type'] }) => {
  const medias = useGroupQuery(mediaCtrl);
  const isAdvanced = useMsg(isAdvanced$);
  const allSelectedById = useMsg(selectedById$);
  const mediaById = byId(medias);
  const mediasByParent = groupBy(medias, (m) => mediaById[m.parent]?.id || '');
  const selectedIds = Object.keys(allSelectedById).filter((id) => mediaById[id]);

  const ctx: MediaCtx = {
    mediaById,
    mediasByParent,
    isAdvanced,
    selectedIds,
  };

  const topMedias = (type ? medias.filter((m) => m.type === type) : mediasByParent['']) || [];

  console.debug('MediaTable', ctx, topMedias);

  return (
    <>
      <Table>
        <TableHead>
          <Row>
            <CellHeader />
            <CellHeader>Titre</CellHeader>
            <CellHeader>Aperçu</CellHeader>
            <CellHeader>Poids</CellHeader>
            <CellHeader>Résolution</CellHeader>
            <CellHeader>Durée</CellHeader>
            <CellHeader />
          </Row>
        </TableHead>
        <TableBody>
          {topMedias.map((m) => (
            <MediaRow key={m.id} m={m} tab={0} ctx={ctx} />
          ))}
        </TableBody>
      </Table>
      <JobsTable class={c('Jobs')} filter={(job) => job.status !== 'finished'} hideEmpty />
    </>
  );
};
