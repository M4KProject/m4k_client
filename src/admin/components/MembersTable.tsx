import { Css } from '@common/ui';
import { toNbr, toStr } from '@common/utils';
import { useGroupQuery } from '@common/hooks';
import {
  Field,
  Button,
  tooltip,
  Table,
  Cell,
  CellHeader,
  Row,
  TableBody,
  TableHead,
} from '@common/components';
import { Trash2 } from 'lucide-react';
import { memberCtrl } from '../controllers';

const c = Css('MemberTable', {});

export const MemberTable = () => {
  const members = useGroupQuery(memberCtrl);

  return (
    <Table  class={c()}>
      <TableHead>
        <Row>
          <CellHeader>Appareil</CellHeader>
          <CellHeader>Email</CellHeader>
          <CellHeader>Droit</CellHeader>
          <CellHeader>Description</CellHeader>
          <CellHeader>Actions</CellHeader>
        </Row>
      </TableHead>
      <TableBody>
        {members.map((m) => (
          <Row key={m.id}>
            <Cell>
              <Field type="switch" value={!!m.device} readonly />
            </Cell>
            <Cell>{m.email}</Cell>
            <Cell>
              <Field
                type="select"
                items={[
                  ['10', 'Lire'],
                  ['20', 'Lire et Écrire'],
                  ['30', 'Administrateur'],
                ]}
                value={toStr(m.role)}
                onValue={(role) => memberCtrl.update(m.id, { role: toNbr(role) })}
              />
            </Cell>
            <Cell>
              <Field
                type="text"
                value={m.desc}
                onValue={(desc) => memberCtrl.update(m.id, { desc })}
              />
            </Cell>
            <Cell variant="around">
              <Button
                icon={<Trash2 />}
                color="error"
                {...tooltip('Supprimer')}
                onClick={() => memberCtrl.delete(m.id)}
              />
            </Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );
};
