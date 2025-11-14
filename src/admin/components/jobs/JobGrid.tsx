import { Trash2 } from 'lucide-react';
import { JobStatus } from './JobStatus';
import { UploadItem, uploadMediaJobs$ } from '../../controllers';
import { Css } from 'fluxio';
import { MediaPreview } from '../medias/MediaPreview';
import { byId } from 'fluxio';
import { useApi, useGroupJobs, useGroupMedias } from '@/hooks/apiHooks';
import { filterItems, Dictionary } from 'fluxio';
import { addTr } from '@/hooks/useTr';
import { Grid, GridCols } from '@/components/Grid';
import { JobModel, MediaModel } from '@/api/models';
import { Tr } from '@/components/Tr';
import { Button } from '@/components/Button';
import { tooltip } from '@/components/Tooltip';
import { useFlux } from '@/hooks/useFlux';
import { ApiCtrl } from '@/api/ApiCtrl';

// Ajout des traductions pour les actions de job
addTr({ convert: 'Convertion du media', addMember: 'Ajouter membre' });

const c = Css('JobGrid', {
  Panel: {
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
  'Panel-close': {
    opacity: 0,
    translateY: '+100%',
  },
  'Panel-open': {
    opacity: 1,
  },
});

const cols: GridCols<JobModel, { mediaById: Dictionary<MediaModel>, api: ApiCtrl }> = {
  action: ['Action', (job) => <Tr>{job.action}</Tr>],
  statut: ['Statut', (job) => <JobStatus job={job} />],
  media: [
    'Media',
    ({ media }, { mediaById }) => <MediaPreview media={media ? mediaById[media] : undefined} />,
  ],
  actions: [
    'Actions',
    (job, { api }) => (
      <Button
        icon={<Trash2 />}
        color="error"
        {...tooltip('Supprimer')}
        onClick={() => api.job.delete(job.id)}
      />
    ),
  ],
};

export interface JobGridProps {
  class?: string;
  filter?: (job: JobModel | UploadItem) => boolean;
  panel?: boolean;
}

export const JobGrid = ({ filter, panel, ...props }: JobGridProps) => {
  const api = useApi();
  const jobs = useGroupJobs();
  const uploadJobs = useFlux(uploadMediaJobs$);
  const uploadJobsList = Object.values(uploadJobs).filter((j) => j !== undefined);
  const allJobs: (JobModel | UploadItem)[] = [...jobs, ...uploadJobsList];
  filterItems(allJobs, filter);
  // sortItems(allJobs, job => -new Date(job.updated).getTime());

  const medias = useGroupMedias();
  const mediaById = byId(medias.filter((m): m is MediaModel => m !== undefined));

  if (panel && allJobs.length === 0) {
    return <div {...c('Panel', 'Panel-close', props)} />;
  }

  const table = <Grid cols={cols} ctx={{ mediaById, api }} items={jobs} />;

  if (panel) {
    return <div {...c('Panel', 'Panel-open', props)}>{table}</div>;
  }

  return table;
};
