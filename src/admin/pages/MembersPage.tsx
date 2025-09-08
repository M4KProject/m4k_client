import { Css, isSearched, toNbr, toStr } from '@common/helpers';
import { useAsync, useCss } from '@common/hooks';
import { useMsg } from '@common/hooks';
import { search$ } from '../messages/search$';
import {
  addJob,
  groupColl,
  memberColl,
  MemberModel,
  ModelUpdate,
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
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (!email) {
      setError('Email requis');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const job = await addJob('addMember', { email });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout du membre');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={(e) => { e.preventDefault(); handle(); }}>
      <Field
        type="email"
        value={email}
        onValue={setEmail}
        error={error}
      />
      <Button title={loading ? "Ajout..." : "Ajouter"} onClick={loading ? undefined : handle} />
    </Form>
  );
};

export const MembersPage = () => {
  const c = useCss('MembersPage', css);
  const search = useMsg(search$);
  const group = useMsg(group$);
  const isAdvanced = useMsg(isAdvanced$);

  const [users, usersRefresh] = useAsync([], () => userColl.find({}));
  const [groups, groupsRefresh] = useAsync([], () => groupColl.find({}));

  const [members, membersRefresh] = useAsync(
    [],
    () => memberColl.find(group ? { group: group.id } : {}),
    null,
    [group]
  );
  const filteredMembers = search ? members.filter((g) => isSearched(g.desc, search)) : members;

  // const emails = useMsg(emails$);
  // const groups = useMsg(groups$);

  const handleAdd = async () => {
    showDialog('Ajouter un membre', (open$) => {
      return (
        <MemberForm
          onClose={() => {
            open$.set(false);
            membersRefresh();
          }}
        />
      );
    });
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
    usersRefresh();
    groupsRefresh();
  };

  return (
    <Page cls={c}>
      <PageHeader title="Les membres">
        <Button title="Ajouter un membre" icon={<Plus />} color="primary" onClick={handleAdd} />
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
                  <Field
                    type="select"
                    items={users.map((u) => [u.id, u.name || u.email || u.id])}
                    value={m.user}
                    onValue={(user) => handleUpdate(m, { user })}
                  />
                  <Div cls={`${c}UserEmail`}>{/* {emails[member.user_id] || ''} */}</Div>
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
