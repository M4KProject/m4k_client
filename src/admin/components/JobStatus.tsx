import { Css, flexRow } from '@common/ui';
import { addTranslates } from '@common/hooks';
import { Div, Tr, Progress } from '@common/components';
import { JobModel } from '@common/api';
import { Play, Square, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const css = Css('JobStatus', {
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
      <Div cls={css(` ${css()}-processing`)}>
        <Progress progress={job.progress || 0} />
      </Div>
    );
  }

  if (status === 'failed') {
    return (
      <Div cls={css(` ${css()}-failed`)}>
        <Tr>{job.error || ''}</Tr>
      </Div>
    );
  }

  return (
    <Div cls={css(` ${css()}-${status}`)}>
      <Icon size={16} />
      <Tr>{status}</Tr>
    </Div>
  );
};
