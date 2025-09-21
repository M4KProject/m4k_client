import { Css, flexRow } from '@common/ui';
import { addTranslates } from '@common/hooks';
import { Tr, Progress } from '@common/components';
import { JobModel } from '@common/api';
import { Play, Square, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const c = Css('JobStatus', {
  '&': {
    ...flexRow({ align: 'center', gap: 0.5 }),
  },
  '& svg': {
    m: 0.5,
  },

  '&-pending': { fg: 'secondary' },
  '&-processing': { fg: 'primary' },
  '&-finished': { fg: 'success' },
  '&-failed': { fg: 'error' },
  '&-deleted': { fg: 'muted' },
});

addTranslates({
  pending: 'En attente',
  processing: 'En cours',
  finished: 'Terminé',
  failed: 'Échec',
  deleted: 'Supprimé',
});

const statusIcons: Record<string, typeof Clock> = {
  pending: Clock,
  processing: Play,
  finished: CheckCircle,
  failed: AlertCircle,
  deleted: Square,
};

interface JobStatusProps {
  job: JobModel;
}

export const JobStatus = ({ job }: JobStatusProps) => {
  const { status } = job;
  const Icon = statusIcons[status] || Square;

  if (status === 'processing') {
    return (
      <div class={c(' ${c()}-processing')}>
        <Progress progress={job.progress || 0} />
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div class={c(' ${c()}-failed')}>
        <Tr>{job.error || ''}</Tr>
      </div>
    );
  }

  return (
    <div class={c(' ${c()}-${status}')}>
      <Icon size={16} />
      <Tr>{status}</Tr>
    </div>
  );
};
