import { Css, flexRow } from '@common/helpers';
import { useCss, useMsg } from '@common/hooks';
import { FormContentModel, TableContentModel } from '@common/api';
import {
  Div,
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
import { MdDeleteForever } from 'react-icons/md';

const css: Css = {
  '&Actions': { ...flexRow({ align: 'center' }) },
};

export const FieldsEdit = ({
  data,
  updateData,
}: ContentProps<TableContentModel> | ContentProps<FormContentModel>) => {
  const c = useCss('TableContent', css);
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
    <Div cls={c}>
      <Div cls={`${c}Actions`}>
        <Button onClick={() => isAdvanced$.next((v) => !v)}>Modifier les champs</Button>
        {isAdvanced && (
          <Button onClick={() => updateData({ fields: [...fields, {}] })}>Ajouter un champ</Button>
        )}
      </Div>
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
                    icon={<MdDeleteForever />}
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
    </Div>
  );
};
