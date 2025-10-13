import { tooltip, Button, GridCols, Grid, Tr } from '@common/components';
import { Trash2 } from 'lucide-react';
import { JobStatus } from './JobStatus';
import { JobModel, MediaModel } from '@common/api';
import { uploadMediaJobs$ } from '../../controllers';
import { jobSync } from '@/api/sync';
import { useMsg, addTr } from '@common/hooks';
import { Css } from '@common/ui';
import { MediaPreview } from '../medias/MediaPreview';
import { byId } from '@common/utils/by';
import { useJobs, useMedias } from '@/api/hooks';
import { filterItems, TMap } from '@common/utils';

// Ajout des traductions pour les actions de job
addTr({ convert: 'Convertion du media', addMember: 'Ajouter membre' });

const c = Css('JobGrid', {
  Panel: {
    position: 'fixed',
    r: 1,
    b: 1,
    w: 40,
    elevation: 3,
    rounded: 2,
    bg: 'b0',
    fCol: 1,
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

const cols: GridCols<JobModel, { mediaById: TMap<MediaModel> }> = {
  action: ['Action', (job) => <Tr>{job.action}</Tr>],
  statut: ['Statut', (job) => <JobStatus job={job} />],
  media: ['Media', ({ media }, { mediaById }) => <MediaPreview media={mediaById[media]} />],
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
  const jobs = useJobs();
  const uploadJobs = useMsg(uploadMediaJobs$);
  const allJobs = [...jobs, ...Object.values(uploadJobs)];
  filterItems(allJobs, filter);
  // sortItems(allJobs, job => -new Date(job.updated).getTime());

  const medias = useMedias();
  const mediaById = byId(medias);

  if (panel && allJobs.length === 0) {
    return <div class={c('Panel', 'Panel-close', props)} />;
  }

  const table = <Grid cols={cols} ctx={{ mediaById }} items={jobs} />;

  if (panel) {
    return <div class={c('Panel', 'Panel-open', props)}>{table}</div>;
  }

  return table;
};
