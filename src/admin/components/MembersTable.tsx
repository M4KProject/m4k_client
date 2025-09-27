import { Css } from '@common/ui';
import { byId, toNbr, toStr } from '@common/utils';
import {
  Field,
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
import { memberSync } from '@/api/sync';
import { useDevices, useMembers } from '@/api/hooks';

const c = Css('MemberTable', {});

export const MemberTable = () => {
  const members = useMembers();
  const devices = useDevices();
  const deviceById = byId(devices);

  return (
    <Table class={c()}>
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
        {members.map((m) => (
          <Row key={m.id}>
            <Cell>
              <Field type="switch" value={!!m.device} readonly />
            </Cell>
            <Cell>{m.device ? deviceById[m.device]?.name : m.email}</Cell>
            <Cell>
              <Field
                type="select"
                items={[
                  ['10', 'Lire'],
                  ['20', 'Lire et Écrire'],
                  ['30', 'Administrateur'],
                ]}
                value={toStr(m.role)}
                onValue={(role) => memberSync.update(m.id, { role: toNbr(role) })}
              />
            </Cell>
            <Cell>
              <Field
                type="text"
                value={m.desc}
                onValue={(desc) => memberSync.update(m.id, { desc })}
              />
            </Cell>
            <Cell variant="around">
              <Button
                icon={<Trash2 />}
                color="error"
                {...tooltip('Supprimer')}
                onClick={() => memberSync.delete(m.id)}
              />
            </Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );
};
