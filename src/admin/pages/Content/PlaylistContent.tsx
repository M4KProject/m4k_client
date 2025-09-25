import { PlaylistContentModel, PlaylistEntry } from '@common/api';
import { Css } from '@common/ui';
import {
  addItem,
  removeIndex,
  toList,
  updateIndex,
  secondsToTimeString,
  parseToSeconds,
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
import { ContentProps } from './ContentProps';
import { Plus, Trash2 } from 'lucide-react';
import { useGroupQuery } from '@common/hooks/useQuery';
import { mediaCtrl } from '@/admin/controllers';

const c = Css('PlaylistContent', {
  '': {
    fCol: 1,
  },
});

export const PlaylistContent = ({ data, updateData }: ContentProps<PlaylistContentModel>) => {
  // Initialiser les données de la playlist si elles n'existent pas
  const items: PlaylistEntry[] = toList(data.items, []);

  const setItems = (items: PlaylistEntry[]) => updateData({ items });

  const handleAdd = () => {
    setItems(addItem(items, { title: 'Nouvelle entrée' }));
  };

  const handleUpdate = (index: number, changes: Partial<PlaylistEntry>) =>
    setItems(updateIndex(items, index, changes));

  const handleDelete = (index: number) => setItems(removeIndex(items, index));

  const medias = useGroupQuery(mediaCtrl);

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
            <CellHead>Media</CellHead>
            <CellHead>Actions</CellHead>
          </RowHead>
        </TableHead>
        <TableBody>
          {items.map((entry, index) => (
            <Row key={index}>
              <Cell>
                <Field value={entry.title} onValue={(title) => handleUpdate(index, { title })} />
              </Cell>
              <Cell>
                <Field
                  type="number"
                  value={entry.duration?.toString() || ''}
                  onValue={(duration) =>
                    handleUpdate(index, { duration: duration ? parseInt(duration) : undefined })
                  }
                />
              </Cell>
              <Cell>
                <Field
                  type="time"
                  value={entry.startTime !== undefined ? secondsToTimeString(entry.startTime) : ''}
                  onValue={(startTime) =>
                    handleUpdate(index, {
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
                    handleUpdate(index, {
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
                  onValue={(language) => handleUpdate(index, { language })}
                />
              </Cell>
              <Cell>
                <Field
                  type="select"
                  value={entry.media || ''}
                  items={medias.map((g) => [g.id, g.title])}
                  onValue={(id) => handleUpdate(index, { media: id || '' })}
                />
              </Cell>
              <Cell variant="around">
                <Button
                  icon={<Trash2 />}
                  color="error"
                  {...tooltip('Supprimer')}
                  onClick={() => handleDelete(index)}
                />
              </Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
      <Button title="Ajouter une entrée" icon={<Plus />} color="primary" onClick={handleAdd} />
    </div>
  );
};
