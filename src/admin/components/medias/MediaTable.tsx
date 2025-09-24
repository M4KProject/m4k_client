import { Css } from '@common/ui';
import { byId, groupBy } from '@common/utils';
import { addTr, useMsg } from '@common/hooks';
import { isAdvanced$, selectedById$ } from '../../messages';
import { MediaModel } from '@common/api';
import { Table, Row, CellHeader, TableHead, TableBody, RowHeader } from '@common/components';
import { JobsTable } from '../jobs/JobsTable';
import { useGroupQuery } from '@common/hooks/useQuery';
import { mediaCtrl } from '../../controllers';
import { MediaCtx, MediaRow } from './MediaRow';

addTr({
  pending: 'en attente',
  uploading: 'téléchargement',
  processing: 'traitement',
  failed: 'échec',
  success: 'succès',
});

const c = Css('MediaTable', {});

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
      <Table class={c()}>
        <TableHead>
          <RowHeader>
            <CellHeader />
            <CellHeader>Titre</CellHeader>
            <CellHeader>Aperçu</CellHeader>
            <CellHeader>Poids</CellHeader>
            <CellHeader>Résolution</CellHeader>
            <CellHeader>Durée</CellHeader>
            <CellHeader />
          </RowHeader>
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
