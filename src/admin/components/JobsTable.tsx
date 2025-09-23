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
import { sort } from '@common/utils/list';
import { JobModel, uploadJobs$ } from '@common/api';
import { useGroupQuery } from '@common/hooks/useQuery';
import { jobCtrl } from '../controllers';
import { useMsg } from '@common/hooks';
import { Css } from '@common/ui';

const c = Css('JobsTable', {});

export interface JobsTableProps {
  class?: string;
  filter?: (job: JobModel) => boolean;
  hideEmpty?: boolean;
}

export const JobsTable = ({ filter, hideEmpty, ...props }: JobsTableProps) => {
  const jobs = useGroupQuery(jobCtrl);

  const uploadJobs = useMsg(uploadJobs$);

  const allJobs = [...jobs, ...Object.values(uploadJobs)];
  const filteredJobs = filter ? allJobs.filter(filter) : allJobs;
  const sortedJobs = sort(filteredJobs, (j) => -new Date(j.updated).getTime());

  if (hideEmpty && sortedJobs.length === 0) return null;

  return (
    <Table class={c('', props)}>
      <TableHead>
        <Row>
          <CellHeader>Action</CellHeader>
          <CellHeader>Statut</CellHeader>
          <CellHeader>Media</CellHeader>
          <CellHeader>Actions</CellHeader>
        </Row>
      </TableHead>
      <TableBody>
        {sortedJobs.map((job) => (
          <Row key={job.id}>
            <Cell>{job.action}</Cell>
            <Cell>
              <JobStatus job={job} />
            </Cell>
            <Cell></Cell>
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
