import { PlaylistEntry, PlaylistModel } from '@common/api';
import { Css } from '@common/ui';
import {
  addItem,
  removeIndex,
  secondsToTimeString,
  parseToSeconds,
  deepClone,
  moveIndex,
} from '@common/utils';
import {
  Table,
  TableHead,
  TableBody,
  Row,
  Cell,
  CellHead,
  Field,
  Button,
  tooltip,
  Flag,
  RowHead,
} from '@common/components';
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
      <Table>
        <TableHead>
          <RowHead>
            <CellHead>Titre</CellHead>
            <CellHead>Durée (s)</CellHead>
            <CellHead>Heure début</CellHead>
            <CellHead>Heure fin</CellHead>
            <CellHead>Langue</CellHead>
            <CellHead>Aperçu</CellHead>
            <CellHead>Media</CellHead>
            <CellHead>Actions</CellHead>
          </RowHead>
        </TableHead>
        <TableBody>
          {playlist.data?.items?.map((entry, index) => (
            <Row key={index}>
              <Cell>
                <Field value={entry.title} onValue={(title) => updateItem(index, { title })} />
              </Cell>
              <Cell>
                <Field
                  type="number"
                  value={entry.duration?.toString() || ''}
                  onValue={(duration) =>
                    updateItem(index, { duration: duration ? parseInt(duration) : undefined })
                  }
                />
              </Cell>
              <Cell>
                <Field
                  type="time"
                  value={entry.startTime !== undefined ? secondsToTimeString(entry.startTime) : ''}
                  onValue={(startTime) =>
                    updateItem(index, {
                      startTime: startTime ? parseToSeconds(startTime) || undefined : undefined,
                    })
                  }
                />
              </Cell>
              <Cell>
                <Field
                  type="time"
                  value={entry.endTime !== undefined ? secondsToTimeString(entry.endTime) : ''}
                  onValue={(endTime) =>
                    updateItem(index, {
                      endTime: endTime ? parseToSeconds(endTime) || undefined : undefined,
                    })
                  }
                />
              </Cell>
              <Cell>
                <Field
                  type="select"
                  value={entry.language || 'fr'}
                  items={[
                    ['fr', <Flag iso="fr" />],
                    ['en', <Flag iso="en" />],
                    ['de', <Flag iso="de" />],
                    ['es', <Flag iso="es" />],
                  ]}
                  onValue={(language) => updateItem(index, { language })}
                />
              </Cell>
              <Cell>
                {entry.media && <MediaPreview media={medias.find((m) => m.id === entry.media)} />}
              </Cell>
              <Cell>
                <Field
                  type="select"
                  value={entry.media || ''}
                  items={medias.map((g) => [g.id, g.title])}
                  onValue={(id) => updateItem(index, { media: id || '' })}
                />
              </Cell>
              <Cell variant="around">
                <Button
                  icon={<ArrowUp />}
                  {...tooltip('Monter')}
                  onClick={() => moveItemIndex(index, index - 1)}
                />
                <Button
                  icon={<ArrowDown />}
                  {...tooltip('Décendre')}
                  onClick={() => moveItemIndex(index, index + 1)}
                />
                <Button
                  icon={<Copy />}
                  {...tooltip('Dupliquer')}
                  onClick={() => duplicateItem(index)}
                />
                <Button
                  icon={<Trash2 />}
                  color="error"
                  {...tooltip('Supprimer')}
                  onClick={() => deleteItem(index)}
                />
              </Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
      <JobsTable filter={(job) => job.status !== 'finished'} panel={true} />
    </div>
  );
};
