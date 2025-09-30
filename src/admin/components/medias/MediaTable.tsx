import { Css } from '@common/ui';
import { byId, groupBy, sortItems } from '@common/utils';
import { addTr, useMsg } from '@common/hooks';
import { MediaModel } from '@common/api';
import { Table, CellHead, TableHead, TableBody, RowHead } from '@common/components';
import { JobsTable } from '../jobs/JobsTable';
import { MediaCtx, MediaRow } from './MediaRow';
import { selectedById$ } from '@/admin/controllers/selected';
import { useMedias } from '@/api/hooks';
import { useIsAdvanced } from '@/router/hooks';

addTr({
  pending: 'en attente',
  uploading: 'téléchargement',
  processing: 'traitement',
  failed: 'échec',
  success: 'succès',
});

const c = Css('MediaTable', {});

export const MediaTable = ({ type }: { type?: MediaModel['type'] }) => {
  const medias = useMedias();
  const isAdvanced = useIsAdvanced();
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
  sortItems(topMedias, (m) => m.title);

  console.debug('MediaTable', ctx, topMedias);

  return (
    <>
      <Table class={c()}>
        <TableHead>
          <RowHead>
            <CellHead />
            <CellHead>Titre</CellHead>
            <CellHead>Aperçu</CellHead>
            <CellHead>Poids</CellHead>
            <CellHead>Résolution</CellHead>
            <CellHead>Durée</CellHead>
            <CellHead />
          </RowHead>
        </TableHead>
        <TableBody>
          {topMedias.map((m) => (
            <MediaRow key={m.id} m={m} tab={0} ctx={ctx} />
          ))}
        </TableBody>
      </Table>
      <JobsTable filter={(job) => job.status !== 'finished'} panel={true} />
    </>
  );
};
