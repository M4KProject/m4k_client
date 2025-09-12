import { Css, isSearched, ReqError, toNbr, toStr } from '@common/helpers';
import { useAsync, useCss } from '@common/hooks';
import { useMsg } from '@common/hooks';
import { search$ } from '../messages/search$';
import {
  groupColl,
  memberColl,
  MemberModel,
  ModelUpdate,
  needGroupId,
  Role,
  userColl,
} from '@common/api';
import {
  Div,
  Field,
  Button,
  Page,
  PageHeader,
  PageBody,
  tooltip,
  Table,
  Cell,
  CellHeader,
  Row,
  TableBody,
  TableHead,
  showDialog,
  Form,
} from '@common/components';
import { Plus, RefreshCw, Trash2 } from 'lucide-react';
import { SearchField } from '../components/SearchField';
import { useState } from 'preact/hooks';
import { isAdvanced$ } from '../messages';
import { group$ } from '../controllers';

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
        await userColl.create({ email, password, passwordConfirm: password });
        await memberColl.create({ email, group: needGroupId(), role: Role.editor });
      } else {
        await memberColl.create({ email, group: needGroupId(), role: Role.editor });
      }
      onClose();
    } catch (e) {
      console.warn('create member', e);
      if (e instanceof ReqError) {
        if (e.status === 404 && !isNew) {
          setIsNewField(true);
          setPassword(randPass(8));
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

export const MembersPage = () => {
  const c = useCss('MembersPage', css);
  const search = useMsg(search$);
  const group = useMsg(group$);
  const isAdvanced = useMsg(isAdvanced$);

  // TODO DEVICES
  const [groups, groupsRefresh] = useAsync([], () => groupColl.find({}));
  const [members, membersRefresh] = useAsync(
    [],
    () => memberColl.find(group ? { group: group.id } : {}),
    null,
    [group]
  );
  const filteredMembers = search ? members.filter((g) => isSearched(g.desc, search)) : members;

  const handleCreate = async () => {
    showDialog('Ajouter un membre', (open$) => (
      <CreateMemberForm
        onClose={() => {
          open$.set(false);
          membersRefresh();
        }}
      />
    ));
  };

  const handleUpdate = async (member: MemberModel, changes: ModelUpdate<MemberModel>) => {
    await memberColl.update(member.id, changes);
    await membersRefresh();
  };

  const handleDelete = async (member: MemberModel) => {
    await memberColl.delete(member.id);
    await membersRefresh();
  };

  const refresh = () => {
    membersRefresh();
    groupsRefresh();
  };

  return (
    <Page cls={c}>
      <PageHeader title="Les membres">
        <Button title="Ajouter un membre" icon={<Plus />} color="primary" onClick={handleCreate} />
        <Button title="Rafraîchir" icon={<RefreshCw />} color="primary" onClick={refresh} />
        <SearchField />
      </PageHeader>
      <PageBody>
        <Table>
          <TableHead>
            <Row>
              {isAdvanced && <CellHeader>Groupe</CellHeader>}
              {isAdvanced && <CellHeader>Appareil</CellHeader>}
              <CellHeader>Email</CellHeader>
              <CellHeader>Role</CellHeader>
              <CellHeader>Description</CellHeader>
              <CellHeader>Actions</CellHeader>
            </Row>
          </TableHead>
          <TableBody>
            {(isAdvanced ? filteredMembers : filteredMembers.filter((m) => !m.device)).map((m) => (
              <Row key={m.id}>
                {isAdvanced && (
                  <Cell>
                    <Field
                      type="select"
                      items={groups.map((g) => [g.id, g.name])}
                      value={m.group}
                      onValue={(group) => handleUpdate(m, { group })}
                    />
                  </Cell>
                )}
                {isAdvanced && (
                  <Cell>
                    <Field type="switch" value={!!m.device} readonly />
                  </Cell>
                )}
                <Cell>{m.email || m.id}</Cell>
                <Cell>
                  <Field
                    type="select"
                    items={[
                      ['10', 'spectateur'],
                      ['20', 'éditeur'],
                      ['30', 'administrateur'],
                    ]}
                    value={toStr(m.role)}
                    onValue={(role) => handleUpdate(m, { role: toNbr(role) })}
                  />
                </Cell>
                <Cell>
                  <Field type="text" value={m.desc} onValue={(desc) => handleUpdate(m, { desc })} />
                </Cell>
                <Cell variant="around">
                  <Button
                    icon={<Trash2 />}
                    color="error"
                    {...tooltip('Supprimer')}
                    onClick={() => handleDelete(m)}
                  />
                </Cell>
              </Row>
            ))}
          </TableBody>
        </Table>
      </PageBody>
    </Page>
  );
};
