import { Css } from '@common/ui';
import { useMsg } from '@common/hooks';
import { FormContentModel, TableContentModel } from '@common/api';
import {
  Button,
  Field,
  FieldInfo,
  Table,
  Cell,
  CellHeader,
  Row,
  TableBody,
  TableHead,
  tooltip,
} from '@common/components';
import { isAdvanced$ } from '../../messages/isAdvanced$';
import { ContentProps } from './ContentProps';
import { ComponentChildren } from 'preact';
import { Trash2 } from 'lucide-react';

const c = Css('TableContent', {
  Actions: { fRow: 'center' },
});

export const FieldsEdit = ({
  data,
  updateData,
}: ContentProps<TableContentModel> | ContentProps<FormContentModel>) => {
  const isAdvanced = useMsg(isAdvanced$);
  const fields = data.fields || [];

  const updateField = async (i: number, changes: Partial<FieldInfo>) => {
    const nextFields = [...fields];
    nextFields[i] = { ...fields[i], ...changes };
    updateData({ fields: nextFields });
  };

  const getItems = (i: number) => {
    return Object.keys(fields[i]?.items || []).join(';');
  };

  const setItems = (i: number, value: string) => {
    const items = value.split(';').map((v) => [v, v] as [string, ComponentChildren]);
    updateField(i, { items });
  };

  return (
    <div class={c()}>
      <div class={c('Actions')}>
        <Button onClick={() => isAdvanced$.next((v) => !v)}>Modifier les champs</Button>
        {isAdvanced && (
          <Button onClick={() => updateData({ fields: [...fields, {}] })}>Ajouter un champ</Button>
        )}
      </div>
      {isAdvanced && (
        <Table>
          <TableHead>
            <Row>
              <CellHeader>Nom</CellHeader>
              <CellHeader>Label</CellHeader>
              <CellHeader>Type</CellHeader>
              <CellHeader>Valeurs</CellHeader>
              <CellHeader>Actions</CellHeader>
            </Row>
          </TableHead>
          <TableBody>
            {fields.map((field, i) => (
              <Row key={i}>
                <Cell>
                  <Field value={field.name} onValue={(next) => updateField(i, { name: next })} />
                </Cell>
                <Cell>
                  <Field value={field.label} onValue={(next) => updateField(i, { label: next })} />
                </Cell>
                <Cell>
                  <Field
                    type="select"
                    value={field.type}
                    onValue={(next) => updateField(i, { type: next })}
                    items={[
                      ['text', 'Texte'],
                      ['multiline', 'Texte (multiligne)'],
                      ['html', 'Texte (enrichi)'],
                      ['color', 'Couleur'],
                      ['number', 'Nombre'],
                      ['select', 'Choix'],
                      ['switch', 'Interrupteur'],
                      ['image', 'Image'],
                      ['doc', 'Document'],
                    ]}
                  />
                </Cell>
                <Cell>
                  {field.type === 'select' && (
                    <Field value={getItems(i)} onValue={(next) => setItems(i, next)} />
                  )}
                </Cell>
                <Cell variant="row">
                  <Button
                    icon={<Trash2 />}
                    color="error"
                    {...tooltip('Supprimer')}
                    onClick={() => {
                      const nextFields = [...fields];
                      nextFields.splice(i, 1);
                      updateData({ fields: nextFields });
                    }}
                  />
                </Cell>
              </Row>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
