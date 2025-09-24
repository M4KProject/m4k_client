import { PlaylistEntry, PlaylistModel } from '@common/api';
import { Css } from '@common/ui';
import { addItem, removeIndex, secondsToTimeString, parseToSeconds } from '@common/utils';
import {
  Table,
  TableHead,
  TableBody,
  Row,
  Cell,
  CellHeader,
  Field,
  Button,
  tooltip,
  Flag,
} from '@common/components';
import { Plus, Trash2 } from 'lucide-react';
import { useGroupQuery } from '@common/hooks/useQuery';
import { mediaCtrl, updatePlaylist } from '@/admin/controllers';

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
  const medias = useGroupQuery(mediaCtrl);

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

  return (
    <div class={c()}>
      <Table>
        <TableHead>
          <Row>
            <CellHeader>Titre</CellHeader>
            <CellHeader>Durée (s)</CellHeader>
            <CellHeader>Heure début</CellHeader>
            <CellHeader>Heure fin</CellHeader>
            <CellHeader>Langue</CellHeader>
            <CellHeader>Media</CellHeader>
            <CellHeader>Actions</CellHeader>
          </Row>
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
                  value={entry.language || ''}
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
                <Field
                  type="select"
                  value={entry.media || ''}
                  items={medias.map((g) => [g.id, g.title])}
                  onValue={(id) => updateItem(index, { media: id || '' })}
                />
              </Cell>
              <Cell variant="around">
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
    </div>
  );
};
