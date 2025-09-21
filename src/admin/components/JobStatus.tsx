import { Css, flexRow } from '@common/ui';
import { addTranslates, useCss } from '@common/hooks';
import { Div, Tr, Progress } from '@common/components';
import { JobModel } from '@common/api';
import { Play, Square, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const css: Css = {
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
};

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
  const c = useCss('JobStatus', css);
  const Icon = statusIcons[status] || Square;

  if (status === 'processing') {
    return (
      <Div cls={`${c} ${c}-processing`}>
        <Progress progress={job.progress || 0} />
      </Div>
    );
  }

  if (status === 'failed') {
    return (
      <Div cls={`${c} ${c}-failed`}>
        <Tr>{job.error || ''}</Tr>
      </Div>
    );
  }

  return (
    <Div cls={`${c} ${c}-${status}`}>
      <Icon size={16} />
      <Tr>{status}</Tr>
    </Div>
  );
};
