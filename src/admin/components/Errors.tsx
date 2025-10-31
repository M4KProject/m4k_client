import { Css } from '@common/ui';
import { isItem, removeItem, ReqError, toError } from 'fluxio';
import { Button, tooltip, GridCols, Grid } from '@common/components';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'preact/hooks';
import { getPbClient } from 'pblite';

const c = Css('Errors', {
  '': {
    position: 'fixed',
    p: 1,
    r: 0.5,
    b: 0.5,
    w: 40,
    elevation: 3,
    rounded: 2,
    bg: 'b0',
    fCol: [],
    transition: 1,
  },
});

interface ErrorItem {
  name: string;
  message: string;
  stack: string | undefined;
  deleted: number;
}

const cols: GridCols<any> = {
  name: ['Nom', (item) => item.name, { props: (item) => tooltip(item.stack) }],
  message: ['Message', (item) => item.message],
  actions: [
    '',
    (item, { deleteItem }) => (
      <Button
        icon={<Trash2 />}
        color="error"
        {...tooltip('Supprimer')}
        onClick={() => deleteItem(item)}
      />
    ),
  ],
};

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
    getPbClient().error$.on((e) => {
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

  return <Grid {...c()} cols={cols} ctx={{ deleteItem }} items={items} />;
};
