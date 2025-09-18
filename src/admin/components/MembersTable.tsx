import { Css } from '@common/ui';
import { randKey, ReqError, toNbr, toStr } from '@common/utils';
import { useCss } from '@common/hooks';
import { Role } from '@common/api/models';
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
  Form,
} from '@common/components';
import { Trash2 } from 'lucide-react';
import { useState } from 'preact/hooks';
import { needGroupId } from '@common/api/messages';
import { collUsers } from '@common/api/collUsers';
import { collMembers } from '@common/api/collMembers';
import { syncMembers } from '@common/api/syncMembers';
import { useSyncColl } from '@common/hooks/useSyncColl';

const css: Css = {};

export const CreateMemberForm = ({ onClose }: { onClose: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isNew, setIsNewField] = useState(false);
  const [error, setError] = useState('');

  const handle = async () => {
    if (!email) {
      setError('Email requis');
      return;
    }
    if (isNew && !password) {
      setError('Mot de passe requis');
      return;
    }
    setError('');
    try {
      if (isNew) {
        await collUsers.create({ email, password, passwordConfirm: password });
        await collMembers.create({ email, group: needGroupId(), role: Role.editor });
      } else {
        await collMembers.create({ email, group: needGroupId(), role: Role.editor });
      }
      onClose();
    } catch (e) {
      console.warn('create member', e);
      if (e instanceof ReqError) {
        if (e.status === 404 && !isNew) {
          setIsNewField(true);
          setPassword(randKey(10));
          return;
        }
      }
      setError(String(e));
    }
  };

  return (
    <Form onSubmit={handle}>
      <Field label="Email" type="email" value={email} onValue={setEmail} error={error} />
      {isNew && (
        <Field label="Mot de passe" type="password" value={password} onValue={setPassword} />
      )}
      <Button type="submit" title="Ajouter" />
    </Form>
  );
};

export const MemberTable = () => {
  const c = useCss('MemberTable', css);

  const members = useSyncColl(syncMembers);

  return (
    <Table cls={c}>
      <TableHead>
        <Row>
          <CellHeader>Appareil</CellHeader>
          <CellHeader>Email</CellHeader>
          <CellHeader>Role</CellHeader>
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
            <Cell>{m.email || m.id}</Cell>
            <Cell>
              <Field
                type="select"
                items={[
                  ['10', 'Spectateur'],
                  ['20', 'Éditeur'],
                  ['30', 'Administrateur'],
                ]}
                value={toStr(m.role)}
                onValue={(role) => syncMembers.update(m, { role: toNbr(role) })}
              />
            </Cell>
            <Cell>
              <Field
                type="text"
                value={m.desc}
                onValue={(desc) => syncMembers.update(m, { desc })}
              />
            </Cell>
            <Cell variant="around">
              <Button
                icon={<Trash2 />}
                color="error"
                {...tooltip('Supprimer')}
                onClick={() => syncMembers.delete(m)}
              />
            </Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );
};
