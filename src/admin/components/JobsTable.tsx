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
import { syncJobs } from '@common/api/syncJobs';
import { useMsg } from '@common/hooks/useMsg';
import { sort } from '@common/utils/list';
import { groupId$ } from '@common/api/messages';
import { useAsyncEffect } from '@common/hooks';

export const JobsTable = () => {
  const groupId = useMsg(groupId$);

  const jobById = useMsg(syncJobs.dict$);
  let jobs = Object.values(jobById);
  jobs = jobs.filter((j) => j.group === groupId);
  jobs = sort(jobs, (j) => -new Date(j.updated).getTime());
  console.debug('jobs', jobs);

  useAsyncEffect(() => syncJobs.init(), []);

  return (
    <Table>
      <TableHead>
        <Row>
          <CellHeader>Action</CellHeader>
          <CellHeader>Statut</CellHeader>
          <CellHeader>Media</CellHeader>
          <CellHeader>Actions</CellHeader>
        </Row>
      </TableHead>
      <TableBody>
        {jobs.map((job) => (
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
                onClick={() => syncJobs.delete(job.id)}
              />
            </Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );
};
