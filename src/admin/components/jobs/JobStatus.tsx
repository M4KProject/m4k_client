import { Css } from '@common/ui';
import { addTr } from '@common/hooks';
import { Tr, Progress } from '@common/components';
import { JobModel } from '@common/api';
import { Play, Square, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { TMap } from '@common/utils/types';

const c = Css('JobStatus', {
  '': {
    fRow: ['center', 'start'],
    gap: 0.5,
  },
  ' svg': {
    m: 0.5,
  },
  '-pending': { fg: 'secondary' },
  '-processing': {
    fg: 'primary',
    w: '100%',
  },
  '-finished': { fg: 'success' },
  '-failed': { fg: 'error' },
  '-deleted': { fg: 'muted' },
});

addTr({
  pending: 'En attente',
  processing: 'En cours',
  finished: 'Terminé',
  failed: 'Échec',
  deleted: 'Supprimé',
});

const statusIcons: TMap<typeof Clock> = {
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
  const status = job.status || 'pending';
  const Icon = statusIcons[status] || statusIcons.pending;

  if (status === 'processing') {
    return (
      <div class={c('', '-processing')}>
        <Progress progress={job.progress || 0} />
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div class={c('', '-failed')}>
        <Tr>{job.error || ''}</Tr>
      </div>
    );
  }

  return (
    <div class={c('', `-${status}`)}>
      <Icon size={16} />
      <Tr>{status}</Tr>
    </div>
  );
};
