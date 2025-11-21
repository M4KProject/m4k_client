import { Css } from 'fluxio';
import { addItem, removeIndex, deepClone, moveIndex } from 'fluxio';
import { Plus, Trash2, Copy, ArrowUp, ArrowDown } from 'lucide-react';
import { updatePlaylist } from '@/admin/controllers';
import { JobGrid } from '../jobs/JobGrid';
import { MediaPreview } from './MediaPreview';
import { useGroupMedias, useApi } from '@/hooks/apiHooks';
import { Grid, GridCols } from '@/components/Grid';
import { JobModel, MediaModel, PlaylistEntry, PlaylistModel } from '@/api/models';
import { Field } from '@/components/Field';
import { Flag } from '@/components/Flag';
import { Button } from '@/components/Button';

const c = Css('EditPlaylist', {
  '': {
    col: 1,
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
    playlistId: string;
  }
> = {
  title: [
    'Titre',
    (entry, ctx, index) => (
      <Field value={entry.title} onValue={(title) => ctx.updateItem(index, { title })} />
    ),
    { w: 240 },
  ],
  startTime: [
    'Heure début',
    (entry, ctx, index) => (
      <Field
        type="seconds"
        value={(entry.startHours || 0) * 3600}
        onValue={(seconds) => ctx.updateItem(index, { startHours: seconds / 3600 })}
      />
    ),
    { w: 160 },
  ],
  endTime: [
    'Heure fin',
    (entry, ctx, index) => (
      <Field
        type="seconds"
        value={(entry.endHours || 24) * 3600}
        onValue={(seconds) => ctx.updateItem(index, { endHours: seconds / 3600 })}
      />
    ),
    { w: 160 },
  ],
  language: [
    'Langue',
    (entry, ctx, index) => (
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
    { w: 160 },
  ],
  preview: [
    'Aperçu',
    (entry, ctx) =>
      entry.media && <MediaPreview media={ctx.medias.find((m) => m.id === entry.media)} />,
    { w: 160 },
  ],
  media: [
    'Media',
    (entry, ctx, index) => (
      <Field
        type="select"
        value={entry.media || ''}
        items={ctx.medias.filter((m) => m.id !== ctx.playlistId).map((g) => [g.id, g.title])}
        onValue={(id) => ctx.updateItem(index, { media: id || '' })}
      />
    ),
    { w: 60 },
  ],
  duration: [
    'Durée (s)',
    (entry, ctx, index) => (
      <Field
        type="number"
        value={entry.duration?.toString() || ''}
        onValue={(duration) =>
          ctx.updateItem(index, { duration: duration ? parseInt(duration) : undefined })
        }
      />
    ),
    { w: 15 },
  ],
  actions: [
    'Actions',
    (_entry, ctx, index) => (
      <div style={{ display: 'flex', gap: '0.5em' }}>
        <Button
          icon={ArrowUp}
          tooltip="Monter"
          onClick={() => ctx.moveItemIndex(index, index - 1)}
        />
        <Button
          icon={ArrowDown}
          tooltip="Décendre"
          onClick={() => ctx.moveItemIndex(index, index + 1)}
        />
        <Button icon={Copy} tooltip="Dupliquer" onClick={() => ctx.duplicateItem(index)} />
        <Button
          icon={Trash2}
          color="error"
          tooltip="Supprimer"
          onClick={() => ctx.deleteItem(index)}
        />
      </div>
    ),
    { w: 40 },
  ],
};

export const AddPlaylistItemButton = ({ playlist }: { playlist: PlaylistModel }) => {
  const api = useApi();
  const newItem = () => {
    updatePlaylist(api, playlist.id, ({ data }) => {
      if (data && data.items) {
        addItem(data.items, { title: 'Nouvelle entrée' });
      }
    });
  };
  return <Button title="Ajouter une entrée" icon={Plus} color="primary" onClick={newItem} />;
};

export const EditPlaylist = ({ playlist }: { playlist: PlaylistModel }) => {
  const api = useApi();
  const medias = useGroupMedias();

  const updateItem = (index: number, changes: Partial<PlaylistEntry>) => {
    updatePlaylist(api, playlist.id, ({ data }) => {
      if (data && data.items && data.items[index]) {
        Object.assign(data.items[index], changes);
      }
    });
  };

  const deleteItem = (index: number) => {
    updatePlaylist(api, playlist.id, ({ data }) => {
      if (data && data.items) {
        removeIndex(data.items, index);
      }
    });
  };

  const duplicateItem = (index: number) => {
    updatePlaylist(api, playlist.id, ({ data }) => {
      if (data && data.items && data.items[index]) {
        const copy = deepClone(data.items[index]);
        addItem(data.items, copy, index + 1);
      }
    });
  };

  const moveItemIndex = (from: number, to: number) => {
    updatePlaylist(api, playlist.id, ({ data }) => {
      if (data && data.items) {
        moveIndex(data.items, from, to);
      }
    });
  };

  return (
    <div {...c()}>
      <Grid
        cols={playlistCols}
        ctx={{
          updateItem,
          moveItemIndex,
          duplicateItem,
          deleteItem,
          medias,
          playlistId: playlist.id,
        }}
        items={playlist.data?.items || []}
      />
      <JobGrid filter={(job) => (job as JobModel)?.status !== 'finished'} panel={true} />
    </div>
  );
};
