import {
  tooltip,
  Table,
  Row,
  CellHead,
  TableHead,
  TableBody,
  Cell,
  Button,
  RowHead,
} from '@common/components';
import { Trash2 } from 'lucide-react';
import { JobStatus } from './JobStatus';
import { JobModel } from '@common/api';
import { uploadMediaJobs$ } from '../../controllers';
import { jobSync } from '@/api/sync';
import { useMsg } from '@common/hooks';
import { Css } from '@common/ui';
import { MediaPreview } from '../medias/MediaPreview';
import { byId } from '@common/utils/by';
import { useJobs, useMedias } from '@/api/hooks';

const c = Css('JobsTable', {
  Panel: {
    position: 'fixed',
    r: 1,
    b: 1,
    w: 40,
    elevation: 3,
    rounded: 2,
    bg: 'b0',
    fCol: 1,
    transition: 1,
    // hMin: 10,
  },
  'Panel-close': {
    opacity: 0,
    translateY: '+100%',
  },
  'Panel-open': {
    opacity: 1,
  },
});

export interface JobsTableProps {
  class?: string;
  filter?: (job: JobModel) => boolean;
  panel?: boolean;
}

export const JobsTable = ({ filter, panel, ...props }: JobsTableProps) => {
  const jobs = useJobs();
  const uploadJobs = useMsg(uploadMediaJobs$);
  const allJobs = [...jobs, ...Object.values(uploadJobs)];
  const filteredJobs = filter ? allJobs.filter(filter) : allJobs;
  // const sortedJobs = sort(filteredJobs, (j) => -new Date(j.updated).getTime());

  const medias = useMedias();
  const mediaById = byId(medias);

  if (panel && filteredJobs.length === 0) {
    return <div class={c('Panel', 'Panel-close', props)} />;
  }

  const table = (
    <Table class={c('', props)}>
      <TableHead>
        <RowHead>
          <CellHead>Action</CellHead>
          <CellHead>Statut</CellHead>
          <CellHead>Media</CellHead>
          <CellHead>Actions</CellHead>
        </RowHead>
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
                onClick={() => jobSync.delete(job.id)}
              />
            </Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );

  if (panel) {
    return <div class={c('Panel', 'Panel-open', props)}>{table}</div>;
  }

  return table;
};
