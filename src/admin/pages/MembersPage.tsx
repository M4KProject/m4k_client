import { Css, isSearched, randPass, ReqError, toErr, toNbr, toStr, uuid } from '@common/helpers';
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

export const MemberForm = ({ onClose }: { onClose: () => void }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handle = async () => {
    if (!email) {
      setError('Email requis');
      return;
    }
    setError('');
    try {
      await memberColl.create({ email, group: needGroupId(), role: Role.editor });
      onClose();
    }
    catch(e) {
      console.warn('add member', e);
      if (e instanceof ReqError) {
        if (e.ctx.status === 404) {
          const password = randPass(8);
          await userColl.create({ email, password, passwordConfirm: password });
          console.debug('password', password);
        }
      }
      setError(String(error));
    }
  };

  return (
    <Form onSubmit={handle}>
      <Field
        label="Email"
        type="email"
        value={email}
        onValue={setEmail}
        error={error}
      />
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
      <MemberForm
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
              <CellHeader>Membre</CellHeader>
              <CellHeader>Role</CellHeader>
              <CellHeader>Actions</CellHeader>
            </Row>
          </TableHead>
          <TableBody>
            {filteredMembers.map((m) => (
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
                <Cell>
                  {m.email}
                </Cell>
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
