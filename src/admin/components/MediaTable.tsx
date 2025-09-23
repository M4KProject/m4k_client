import { Css } from '@common/ui';
import { byId, firstUpper, groupBy, isEmpty } from '@common/utils';
import { addTr, useMsg } from '@common/hooks';
import { isAdvanced$, selectedById$ } from '../messages';
import { FolderPlus, MapPlus, Upload } from 'lucide-react';
import { uploadJobs$, needAuthId, needGroupId, MediaModel, upload } from '@common/api';
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
import { jobCtrl, mediaCtrl } from '../controllers';
import { MediaCtx, MediaRow } from './MediaRow';

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

export const getNextTitle = (medias: MediaModel[], start: string) => {
  let i = 1;
  let title = start;
  while (true) {
    if (!medias.find((m) => m.title === title)) break;
    title = start + ++i;
  }
  return title;
};

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
      <Toolbar title={firstUpper(type ? type : 'media') + 's'}>
        {!type && (
          <Button
            icon={<FolderPlus />}
            {...tooltip('Créer un nouveau dossier')}
            onClick={() => {
              mediaCtrl.create({
                title: getNextTitle(medias, 'Dossier'),
                mime: 'application/folder',
                type: 'folder',
                user: needAuthId(),
                group: needGroupId(),
              });
            }}
          >
            Nouveau dossier
          </Button>
        )}
        {type === 'playlist' && (
          <Button
            icon={<MapPlus />}
            {...tooltip('Créer une playlist')}
            onClick={() => {
              mediaCtrl.create({
                title: getNextTitle(medias, 'Playlist'),
                mime: 'application/playlist',
                type: 'playlist',
                user: needAuthId(),
                group: needGroupId(),
              });
            }}
          >
            Ajouter Playlist
          </Button>
        )}
        <UploadButton
          title="Téléverser"
          {...tooltip('Téléverser des medias')}
          icon={<Upload />}
          color="primary"
          onFiles={upload}
        />
        <SearchField />
      </Toolbar>
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
