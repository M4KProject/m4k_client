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
import { JobModel } from '@common/api';
import { useGroupQuery } from '@common/hooks/useQuery';
import { jobCtrl } from '../controllers';

export const JobsTable = ({ filter }: { filter?: (job: JobModel) => boolean }) => {
  const jobs = useGroupQuery(jobCtrl);
  const filteredJobs = filter ? jobs.filter(filter) : jobs;
  const sortedJobs = sort(filteredJobs, (j) => -new Date(j.updated).getTime());
  console.debug('jobs', sortedJobs);

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
