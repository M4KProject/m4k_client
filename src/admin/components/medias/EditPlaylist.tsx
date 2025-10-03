import { PlaylistEntry, PlaylistModel, MediaModel } from '@common/api';
import { Css } from '@common/ui';
import {
  addItem,
  removeIndex,
  secondsToTimeString,
  parseToSeconds,
  deepClone,
  moveIndex,
} from '@common/utils';
import { Grid, Field, Button, tooltip, Flag } from '@common/components';
import { GridCols } from '@common/components/Grid';
import { Plus, Trash2, Copy, ArrowUp, ArrowDown } from 'lucide-react';
import { updatePlaylist } from '@/admin/controllers';
import { JobsTable } from '../jobs/JobsTable';
import { MediaPreview } from './MediaPreview';
import { useMedias } from '@/api/hooks';

const c = Css('EditPlaylist', {
  '': {
    fCol: 1,
  },
});

const playlistCols: GridCols<
  PlaylistEntry,
  {
    updateItem: (index: number, data: Partial<PlaylistEntry>) => void;
    moveItemIndex: (from: number, to: number) => void;
    duplicateItem: (index: number) => void;
    deleteItem: (index: number) => void;
    medias: MediaModel[];
  }
> = {
  title: {
    title: 'Titre',
    val: (entry, ctx, index) => (
      <Field value={entry.title} onValue={(title) => ctx.updateItem(index, { title })} />
    ),
  },
  duration: {
    title: 'Durée (s)',
    val: (entry, ctx, index) => (
      <Field
        type="number"
        value={entry.duration?.toString() || ''}
        onValue={(duration) =>
          ctx.updateItem(index, { duration: duration ? parseInt(duration) : undefined })
        }
      />
    ),
  },
  startTime: {
    title: 'Heure début',
    val: (entry, ctx, index) => (
      <Field
        type="time"
        value={entry.startTime !== undefined ? secondsToTimeString(entry.startTime) : ''}
        onValue={(startTime) =>
          ctx.updateItem(index, {
            startTime: startTime ? parseToSeconds(startTime) || undefined : undefined,
          })
        }
      />
    ),
  },
  endTime: {
    title: 'Heure fin',
    val: (entry, ctx, index) => (
      <Field
        type="time"
        value={entry.endTime !== undefined ? secondsToTimeString(entry.endTime) : ''}
        onValue={(endTime) =>
          ctx.updateItem(index, {
            endTime: endTime ? parseToSeconds(endTime) || undefined : undefined,
          })
        }
      />
    ),
  },
  language: {
    title: 'Langue',
    val: (entry, ctx, index) => (
      <Field
        type="select"
        value={entry.language || 'fr'}
        items={[
          ['fr', <Flag iso="fr" />],
          ['en', <Flag iso="en" />],
          ['de', <Flag iso="de" />],
          ['es', <Flag iso="es" />],
        ]}
        onValue={(language) => ctx.updateItem(index, { language })}
      />
    ),
  },
  preview: {
    title: 'Aperçu',
    val: (entry, ctx) =>
      entry.media && <MediaPreview media={ctx.medias.find((m) => m.id === entry.media)} />,
  },
  media: {
    title: 'Media',
    val: (entry, ctx, index) => (
      <Field
        type="select"
        value={entry.media || ''}
        items={ctx.medias.map((g) => [g.id, g.title])}
        onValue={(id) => ctx.updateItem(index, { media: id || '' })}
      />
    ),
  },
  actions: {
    title: 'Actions',
    val: (_entry, ctx, index) => (
      <div style={{ display: 'flex', gap: '0.5em' }}>
        <Button
          icon={<ArrowUp />}
          {...tooltip('Monter')}
          onClick={() => ctx.moveItemIndex(index, index - 1)}
        />
        <Button
          icon={<ArrowDown />}
          {...tooltip('Décendre')}
          onClick={() => ctx.moveItemIndex(index, index + 1)}
        />
        <Button
          icon={<Copy />}
          {...tooltip('Dupliquer')}
          onClick={() => ctx.duplicateItem(index)}
        />
        <Button
          icon={<Trash2 />}
          color="error"
          {...tooltip('Supprimer')}
          onClick={() => ctx.deleteItem(index)}
        />
      </div>
    ),
  },
};

export const AddPlaylistItemButton = ({ playlist }: { playlist: PlaylistModel }) => {
  const newItem = () => {
    updatePlaylist(playlist.id, ({ data }) => {
      addItem(data.items, { title: 'Nouvelle entrée' });
    });
  };
  return <Button title="Ajouter une entrée" icon={<Plus />} color="primary" onClick={newItem} />;
};

export const EditPlaylist = ({ playlist }: { playlist: PlaylistModel }) => {
  const medias = useMedias();

  const updateItem = (index: number, changes: Partial<PlaylistEntry>) => {
    updatePlaylist(playlist.id, ({ data }) => {
      Object.assign(data.items[index], changes);
    });
  };

  const deleteItem = (index: number) => {
    updatePlaylist(playlist.id, ({ data }) => {
      removeIndex(data.items, index);
    });
  };

  const duplicateItem = (index: number) => {
    updatePlaylist(playlist.id, ({ data: { items } }) => {
      const copy = deepClone(items[index]);
      addItem(items, copy, index + 1);
    });
  };

  const moveItemIndex = (from: number, to: number) => {
    updatePlaylist(playlist.id, ({ data: { items } }) => {
      moveIndex(items, from, to);
    });
  };

  return (
    <div class={c()}>
      <Grid
        cols={playlistCols}
        ctx={{ updateItem, moveItemIndex, duplicateItem, deleteItem, medias }}
        items={playlist.data?.items || []}
      />
      <JobsTable filter={(job) => job.status !== 'finished'} panel={true} />
    </div>
  );
};
