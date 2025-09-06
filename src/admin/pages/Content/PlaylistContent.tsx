import { mediaColl, PlaylistContentModel, PlaylistEntry } from '@common/api';
import {
  addItem,
  Css,
  flexColumn,
  removeIndex,
  toList,
  updateIndex,
  secondsToTimeString,
  parseToSeconds,
} from '@common/helpers';
import { useAsync, useCss } from '@common/hooks';
import {
  Div,
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
import { ContentProps } from './ContentProps';
import { MdAddToPhotos, MdDeleteForever } from 'react-icons/md';

const css: Css = {
  '&': {
    ...flexColumn(),
  },
};

export const PlaylistContent = ({ data, updateData }: ContentProps<PlaylistContentModel>) => {
  const c = useCss('PlaylistContent', css);

  // Initialiser les données de la playlist si elles n'existent pas
  const items: PlaylistEntry[] = toList(data.items, []);

  const setItems = (items: PlaylistEntry[]) => updateData({ items });

  const handleAdd = () => {
    setItems(addItem(items, { title: 'Nouvelle entrée' }));
  };

  const handleUpdate = (index: number, changes: Partial<PlaylistEntry>) =>
    setItems(updateIndex(items, index, changes));

  const handleDelete = (index: number) => setItems(removeIndex(items, index));

  const [medias] = useAsync([], () => mediaColl.find({}));

  return (
    <Div cls={c}>
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
                  items={medias.map((g) => [g.id, g.name])}
                  onValue={(id) => handleUpdate(index, { media: id || '' })}
                />
              </Cell>
              <Cell variant="around">
                <Button
                  icon={<MdDeleteForever />}
                  color="error"
                  {...tooltip('Supprimer')}
                  onClick={() => handleDelete(index)}
                />
              </Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
      <Button
        title="Ajouter une entrée"
        icon={<MdAddToPhotos />}
        color="primary"
        onClick={handleAdd}
      />
    </Div>
  );
};
