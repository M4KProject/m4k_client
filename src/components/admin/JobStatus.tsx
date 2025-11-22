import { Css } from 'fluxio';
import { Play, Square, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Dictionary } from 'fluxio';
import { addTr } from '@/hooks/useTr';
import { JobModel } from '@/api/models';
import { Progress } from '@/components/Progress';
import { Tr } from '@/components/Tr';

const c = Css('JobStatus', {
  '': {
    row: ['center', 'start'],
    gap: 0.5,
  },
  ' svg': {
    m: 4,
  },
  '-pending': { fg: 's' },
  '-processing': {
    fg: 'p',
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

const statusIcons: Dictionary<typeof Clock> = {
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
      <div {...c('', '-processing')}>
        <Progress progress={job.progress || 0} />
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div {...c('', '-failed')}>
        <Tr>{job.error || ''}</Tr>
      </div>
    );
  }

  return (
    <div {...c('', `-${status}`)}>
      <Icon size={16} />
      <Tr>{status}</Tr>
    </div>
  );
};
