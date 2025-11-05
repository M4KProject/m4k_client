import { tooltip, Button, GridCols, Grid, Tr } from '@common/components';
import { Trash2 } from 'lucide-react';
import { JobStatus } from './JobStatus';
import { JobModel, MediaModel } from '@/api';
import { uploadMediaJobs$ } from '../../controllers';
import { jobSync } from '@/api/sync';
import { useFlux, addTr } from '@common/hooks';
import { Css } from 'fluxio';
import { MediaPreview } from '../medias/MediaPreview';
import { byId } from 'fluxio';
import { useGroupJobs, useGroupMedias } from '@/api/hooks';
import { filterItems, Dictionary } from 'fluxio';

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
    bg: 'b0',
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

const cols: GridCols<JobModel, { mediaById: Dictionary<MediaModel> }> = {
  action: ['Action', (job) => <Tr>{job.action}</Tr>],
  statut: ['Statut', (job) => <JobStatus job={job} />],
  media: [
    'Media',
    ({ media }, { mediaById }) => <MediaPreview media={media ? mediaById[media] : undefined} />,
  ],
  actions: [
    'Actions',
    (job) => (
      <Button
        icon={<Trash2 />}
        color="error"
        {...tooltip('Supprimer')}
        onClick={() => jobSync.delete(job.id)}
      />
    ),
  ],
};

export interface JobGridProps {
  class?: string;
  filter?: (job: JobModel) => boolean;
  panel?: boolean;
}

export const JobGrid = ({ filter, panel, ...props }: JobGridProps) => {
  const jobs = useGroupJobs();
  const uploadJobs = useFlux(uploadMediaJobs$);
  const uploadJobsList = Object.values(uploadJobs).filter((j) => j !== undefined);
  const allJobs: JobModel[] = [...jobs, ...uploadJobsList];
  filterItems(allJobs, filter);
  // sortItems(allJobs, job => -new Date(job.updated).getTime());

  const medias = useGroupMedias();
  const mediaById = byId(medias.filter((m): m is MediaModel => m !== undefined));

  if (panel && allJobs.length === 0) {
    return <div {...c('Panel', 'Panel-close', props)} />;
  }

  const table = <Grid cols={cols} ctx={{ mediaById }} items={jobs} />;

  if (panel) {
    return <div {...c('Panel', 'Panel-open', props)}>{table}</div>;
  }

  return table;
};
