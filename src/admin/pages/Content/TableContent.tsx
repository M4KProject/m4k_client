import { Css, clone } from '@common/helpers';
import { useCss } from '@common/hooks';
import { TableContentModel } from '@common/api';
import { Button } from '@common/components';
import { Copy, Trash2 } from 'lucide-react';
import {
  Div,
  Field,
  Table,
  Cell,
  CellHeader,
  Row,
  TableBody,
  TableHead,
  tooltip,
} from '@common/components';
import { ContentProps } from './ContentProps';
import { FieldsEdit } from './FieldsEdit';
import { app } from '../../../app';

const css: Css = {};

export const TableContent = (props: ContentProps<TableContentModel>) => {
  const { data, updateData } = props;
  const c = useCss('TableContent', css);
  const fields = data.fields || [];
  const items = data.items || [];

  app.data = data;
  app.updateData = updateData;

  return (
    <Div cls={c}>
      <FieldsEdit {...props} />
      <Table>
        <TableHead>
          <Row>
            {fields.map((field, i) => (
              <CellHeader key={i}>{field.label}</CellHeader>
            ))}
            <CellHeader>Actions</CellHeader>
          </Row>
        </TableHead>
        <TableBody>
          {items.map((item, i) => (
            <Row key={i}>
              {fields.map((field) => {
                const { name } = field;
                if (!name) return null;
                return (
                  <Cell key={name}>
                    <Field
                      {...field}
                      value={item ? item[name] : undefined}
                      onValue={(next) => {
                        const nextItem = {
                          ...(item || {}),
                          [name]: next,
                        };
                        const nextItems = [...items];
                        nextItems[i] = nextItem;
                        updateData({ items: nextItems });
                      }}
                      label={undefined}
                    />
                  </Cell>
                );
              })}
              <Cell variant="row">
                <Button
                  icon={<Copy />}
                  color="primary"
                  {...tooltip('Copier')}
                  onClick={() => {
                    const nextItems = [...items];
                    const copy = clone(items[i]);
                    nextItems.splice(i, 0, copy);
                    updateData({ items: nextItems });
                  }}
                />
                <Button
                  icon={<Trash2 />}
                  color="error"
                  {...tooltip('Supprimer')}
                  onClick={() => {
                    const nextItems = [...items];
                    nextItems.splice(i, 1);
                    updateData({ items: nextItems });
                  }}
                />
              </Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
      <Button onClick={() => updateData({ items: [...items, {}] })}>Ajouter une ligne</Button>
    </Div>
  );
};

export default TableContent;
