import { GroupModel, JobModel, ModelUpdate } from '@common/api';
import {
  tooltip,
  Table,
  Row,
  CellHeader,
  TableHead,
  TableBody,
  Cell,
  Field,
  Button,
  Progress,
} from '@common/components';
import { Trash2 } from 'lucide-react';
import { JobStatusIcon } from './JobStatusIcon';

interface JobsTableProps {
  jobs: JobModel[];
  groups: GroupModel[];
  isAdvanced: boolean;
  onUpdate: (job: JobModel, changes: ModelUpdate<JobModel>) => Promise<void>;
  onDelete: (job: JobModel) => Promise<void>;
}

export const JobsTable = ({ jobs, groups, isAdvanced, onUpdate, onDelete }: JobsTableProps) => {
  const handleInputChange = (job: JobModel, input: string) => {
    try {
      const parsed = JSON.parse(input);
      onUpdate(job, { input: parsed });
    } catch (e) {
      console.error('Invalid JSON:', e);
    }
  };

  return (
    <Table>
      <TableHead>
        <Row>
          {isAdvanced && <CellHeader>Groupe</CellHeader>}
          <CellHeader>Action</CellHeader>
          <CellHeader>Statut</CellHeader>
          <CellHeader>Progression</CellHeader>
          <CellHeader>Paramètres</CellHeader>
          <CellHeader>Erreur</CellHeader>
          <CellHeader>Actions</CellHeader>
        </Row>
      </TableHead>
      <TableBody>
        {jobs.map((job) => (
          <Row key={job.id}>
            {isAdvanced && (
              <Cell>
                <Field
                  type="select"
                  items={groups.map((g) => [g.id, g.name])}
                  value={job.group}
                  onValue={(group) => onUpdate(job, { group })}
                />
              </Cell>
            )}
            <Cell>{job.action}</Cell>
            <Cell>
              <JobStatusIcon status={job.status} />
            </Cell>
            <Cell>
              <Progress progress={job.progress || 0} />
            </Cell>
            <Cell>
              <Field
                value={JSON.stringify(job.input, null, 2)}
                onValue={(input) => handleInputChange(job, input)}
              />
            </Cell>
            <Cell cls={job.error ? 'error' : ''}>{job.error || '-'}</Cell>
            <Cell variant="around">
              <Button
                icon={<Trash2 />}
                color="error"
                {...tooltip('Supprimer')}
                onClick={() => onDelete(job)}
              />
            </Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );
};
