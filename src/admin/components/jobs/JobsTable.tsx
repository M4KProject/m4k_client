import {
  tooltip,
  Table,
  Row,
  CellHeader,
  TableHead,
  TableBody,
  Cell,
  Button,
} from '@common/components';
import { Trash2 } from 'lucide-react';
import { JobStatus } from './JobStatus';
import { JobModel, uploadJobs$ } from '@common/api';
import { useGroupQuery, useQuery } from '@common/hooks/useQuery';
import { jobCtrl, mediaCtrl } from '../../controllers';
import { useMsg } from '@common/hooks';
import { Css } from '@common/ui';
import { MediaPreview } from '../medias/MediaPreview';
import { byId } from '@common/utils/by';

const c = Css('JobsTable', {
  '-panel': {
    position: 'fixed',
    r: 1,
    b: 1,
    w: 40,
  },
});

export interface JobsTableProps {
  class?: string;
  filter?: (job: JobModel) => boolean;
  panel?: boolean;
}

export const JobsTable = ({ filter, panel, ...props }: JobsTableProps) => {
  const jobs = useGroupQuery(jobCtrl);
  const uploadJobs = useMsg(uploadJobs$);
  const allJobs = [...jobs, ...Object.values(uploadJobs)];
  const filteredJobs = filter ? allJobs.filter(filter) : allJobs;
  // const sortedJobs = sort(filteredJobs, (j) => -new Date(j.updated).getTime());

  const medias = useQuery(mediaCtrl);
  const mediaById = byId(medias);

  if (panel && filteredJobs.length === 0) return null;

  return (
    <Table class={c('', panel && '-panel', props)}>
      <TableHead>
        <Row>
          <CellHeader>Action</CellHeader>
          <CellHeader>Statut</CellHeader>
          <CellHeader>Media</CellHeader>
          <CellHeader>Actions</CellHeader>
        </Row>
      </TableHead>
      <TableBody>
        {filteredJobs.map((job) => (
          <Row key={job.id}>
            <Cell>{job.action}</Cell>
            <Cell>
              <JobStatus job={job} />
            </Cell>
            <Cell>
              <MediaPreview media={mediaById[job.media]} />
            </Cell>
            <Cell variant="around">
              <Button
                icon={<Trash2 />}
                color="error"
                {...tooltip('Supprimer')}
                onClick={() => jobCtrl.delete(job.id)}
              />
            </Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );
};
