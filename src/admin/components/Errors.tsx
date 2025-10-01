import { Css } from '@common/ui';
import { isItem, removeItem, ReqError, toError } from '@common/utils';
import {
  Button,
  tooltip,
  Table,
  Cell,
  CellHead,
  Row,
  TableBody,
  TableHead,
  RowHead,
} from '@common/components';
import { Trash2 } from 'lucide-react';
import { apiError$ } from '@common/api';
import { useEffect, useState } from 'preact/hooks';

const c = Css('Errors', {
  '': {
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
});

interface ErrorItem {
  name: string;
  message: string;
  stack: string;
  deleted: number;
}

const errorToItem = (e: any) => {
  const error = toError(e);
  let { name, message, stack } = error;
  let deleted = Date.now() + 5 * 1000;

  if (error instanceof ReqError) {
    const d = error.data || {};
    if (d.message) message = d.message;
    if (isItem(d.data)) {
      for (const fieldName in d.data) {
        const fieldMessage = d.data[fieldName].message;
        message += `\n${fieldName}: ${fieldMessage}`;
      }
    }
  }

  return { name, message, stack, deleted };
};

const useErrorItems = () => {
  const [items, setItems] = useState<ErrorItem[]>([]);

  const filterDeleted = (item: ErrorItem) => item.deleted < Date.now();

  const pushItem = (item: ErrorItem) => {
    setItems((items) => [...items.filter(filterDeleted), item]);
  };

  const deleteItem = (item: ErrorItem) => {
    setItems((items) => removeItem([...items], item));
  };

  useEffect(() =>
    apiError$.on((e) => {
      pushItem(errorToItem(e));
    })
  );

  useEffect(() => {
    const t = setTimeout(() => {
      setItems((items) => items.filter(filterDeleted));
    }, 5000);
    return () => {
      clearTimeout(t);
    };
  }, [items]);

  return { items, deleteItem };
};

export const Errors = () => {
  const { items, deleteItem } = useErrorItems();

  if (items.length === 0) return null;

  return (
    <div class={c()}>
      <Table>
        <TableHead>
          <RowHead>
            <CellHead>Appareil</CellHead>
            <CellHead>Titre</CellHead>
            <CellHead>Droit</CellHead>
            <CellHead>Description</CellHead>
            <CellHead>Actions</CellHead>
          </RowHead>
        </TableHead>
        <TableBody>
          {items.map((item, index) => (
            <Row key={index}>
              <Cell {...tooltip(item.stack)}>{item.name}</Cell>
              <Cell>{item.message}</Cell>
              <Cell variant="around">
                <Button
                  icon={<Trash2 />}
                  color="error"
                  {...tooltip('Supprimer')}
                  onClick={() => deleteItem(item)}
                />
              </Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
