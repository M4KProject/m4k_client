import { Css, flexRow } from '@common/ui';
import { useCss } from '@common/hooks';
import { Div, Tr } from '@common/components';
import { Play, Square, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const css: Css = {
  '&': {
    ...flexRow({ align: 'center', gap: 0.5 }),
  },

  '&-pending': { fg: 'secondary' },
  '&-processing': { fg: 'primary' },
  '&-finished': { fg: 'success' },
  '&-failed': { fg: 'error' },
  '&-deleted': { fg: 'muted' },
};

const statusIcons: Record<string, typeof Clock> = {
  pending: Clock,
  processing: Play,
  finished: CheckCircle,
  failed: AlertCircle,
  deleted: Square,
};

interface JobStatusIconProps {
  status: string;
}

export const JobStatusIcon = ({ status }: JobStatusIconProps) => {
  const c = useCss('JobStatus', css);
  const Icon = statusIcons[status] || Square;

  return (
    <Div cls={`${c} ${c}-${status}`}>
      <Icon size={16} />
      <Tr>{status}</Tr>
    </Div>
  );
};
