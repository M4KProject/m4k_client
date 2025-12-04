import {
  AlertCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  PlayIcon,
  SquareIcon,
  Trash2,
} from 'lucide-react';
import { Css } from 'fluxio';
import { byId } from 'fluxio';
import { useApi, useGroupJobs, useGroupMedias } from '@/hooks/useApi';
import { filterItems, Dictionary } from 'fluxio';
import { addTr } from '@/hooks/useTr';
import { Grid, GridCols } from '@/components/common/Grid';
import { JobModel, MediaModel } from '@/api/models';
import { Tr } from '@/components/common/Tr';
import { Button } from '@/components/common/Button';
import { useFlux } from '@/hooks/useFlux';
import { Api } from '@/api/Api';
import { UploadItem, uploadMediaJobs$ } from '@/controllers/media';
import { MediaPreview } from '../medias/MediaPreview';
import { Progress } from '../common/Progress';

// Ajout des traductions pour les actions de job
addTr({ convert: 'Convertion du media', addMember: 'Ajouter membre' });

const c = Css('Jobs', {
  '': {
    position: 'fixed',
    r: 1,
    b: 1,
    w: 40,
    elevation: 3,
    rounded: 5,
    bg: 'bg',
    col: 1,
    transition: 1,
  },
  '-close': {
    opacity: 0,
    translateY: '+100%',
  },
  '-open': {
    opacity: 1,
  },
});

const cStatus = Css('JobStatus', {
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

const cols: GridCols<JobModel, { mediaById: Dictionary<MediaModel>; api: Api }> = {
  action: ['Action', (job) => <Tr>{job.action}</Tr>],
  statut: [
    'Statut',
    (job) => {
      const status = job.status || 'pending';
      const statusIcons: Dictionary<typeof ClockIcon> = {
        pending: ClockIcon,
        processing: PlayIcon,
        finished: CheckCircleIcon,
        failed: AlertCircleIcon,
        deleted: SquareIcon,
      };
      const Icon = statusIcons[status] || statusIcons.pending;

      if (status === 'processing') {
        return (
          <div {...cStatus('', '-processing')}>
            <Progress progress={job.progress || 0} />
          </div>
        );
      }

      if (status === 'failed') {
        return (
          <div {...cStatus('', '-failed')}>
            <Tr>{job.error || ''}</Tr>
          </div>
        );
      }

      return (
        <div {...cStatus('', `-${status}`)}>
          <Icon size={16} />
          <Tr>{status}</Tr>
        </div>
      );
    },
  ],
  media: [
    'Media',
    ({ media }, { mediaById }) => <MediaPreview media={media ? mediaById[media] : undefined} />,
  ],
  actions: [
    'Actions',
    (job, { api }) => (
      <Button
        icon={Trash2}
        color="error"
        tooltip="Supprimer"
        onClick={() => api.job.delete(job.id)}
      />
    ),
  ],
};

export interface JobsProps {
  class?: string;
  filter?: (job: JobModel | UploadItem) => boolean;
  window?: boolean;
}

export const Jobs = ({ filter, ...props }: JobsProps) => {
  const api = useApi();
  const jobs = useGroupJobs();
  const uploadJobs = useFlux(uploadMediaJobs$);
  const uploadJobsList = Object.values(uploadJobs).filter((j) => j !== undefined);
  const allJobs: (JobModel | UploadItem)[] = [...jobs, ...uploadJobsList] as any;
  filterItems(allJobs, filter);
  // sortItems(allJobs, job => -new Date(job.updated).getTime());

  const medias = useGroupMedias();
  const mediaById = byId(medias.filter((m): m is MediaModel => m !== undefined));

  return (
    <div {...c('', props)}>
      <Grid cols={cols} ctx={{ mediaById, api }} items={jobs} />
    </div>
  );
};

export const JobsWindow = () => {
  // filter={(job) => job.status !== 'finished'} panel={true}
  return <div />;
};
