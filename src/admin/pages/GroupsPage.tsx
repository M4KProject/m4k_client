import { useAsync, useCss, useMsg } from '@common/hooks';
import { search$ } from '../messages/search$';
import { Plus, RefreshCw, Trash2 } from 'lucide-react';
import {
  Field,
  Button,
  Table,
  Cell,
  CellHeader,
  Row,
  TableBody,
  TableHead,
  Page,
  PageHeader,
  PageBody,
  tooltip,
  showError,
} from '@common/components';
import { isSearched, Css } from '@common/helpers';
import { SearchField } from '../components/SearchField';
import { ModelUpdate, GroupModel, groupColl, memberColl, Role, auth$ } from '@common/api';
import { group$ } from '../controllers';
import { isAdvanced$ } from '../messages';
import { useEffect } from 'preact/hooks';

const css: Css = {};

export const GroupsPage = () => {
  const c = useCss('GroupsPage', css);
  const search = useMsg(search$);
  const auth = useMsg(auth$);
  const group = useMsg(group$);
  const isAdvanced = useMsg(isAdvanced$);

  const [groups, groupsRefresh] = useAsync([], () => groupColl.find({}));
  const filteredGroups = search ? groups.filter((g) => isSearched(g.name, search)) : groups;

  const handleAdd = async () => {
    if (!auth) return;
    const group = await groupColl
      .create({ name: 'Nouveau Groupe', user: auth.id })
      .catch(showError);
    if (group) {
      await memberColl
        .create({
          user: auth.id,
          group: group.id,
          role: Role.viewer,
        })
        .catch(showError);
    }
    await groupsRefresh();
  };

  const handleUpdate = async (group: GroupModel, changes: ModelUpdate<GroupModel>) => {
    if (!auth) return;
    await groupColl.update(group.id, changes).catch(showError);
    await groupsRefresh();
  };

  const handleDelete = async (group: GroupModel) => {
    if (!auth) return;
    await groupColl.delete(group.id).catch(showError);
    await groupsRefresh();
  };

  useEffect(() => {
    if (!group) group$.set(groups[0] || null);
    else if (groups.length === 0) group$.set(null);
  }, [group, groups]);

  console.debug('GroupsPage', { c, search, auth, group, isAdvanced, groups, filteredGroups });

  return (
    <Page cls={c}>
      <PageHeader title="Gestionnaire de groupes">
        <Button title="Ajouter" icon={<Plus />} color="primary" onClick={handleAdd} />
        <Button title="Rafraîchir" icon={<RefreshCw />} color="primary" onClick={groupsRefresh} />
        <SearchField />
      </PageHeader>
      <PageBody>
        <Table>
          <TableHead>
            <Row>
              <CellHeader>Sélectionné</CellHeader>
              {isAdvanced && <CellHeader>Clé</CellHeader>}
              <CellHeader>Nom</CellHeader>
              <CellHeader>Actions</CellHeader>
            </Row>
          </TableHead>
          <TableBody>
            {filteredGroups.map((g, i) => (
              <Row key={g.id}>
                <Cell>
                  <Field
                    name={'C' + i}
                    type="switch"
                    value={group?.id === g.id}
                    onValue={(v) => group$.set(v ? g : null)}
                  />
                </Cell>
                {isAdvanced && (
                  <Cell>
                    <Field
                      {...tooltip(g.id)}
                      value={g.key}
                      onValue={(key) => handleUpdate(g, { key })}
                    />
                  </Cell>
                )}
                <Cell>
                  <Field value={g.name} onValue={(name) => handleUpdate(g, { name })} />
                </Cell>
                <Cell variant="row">
                  <Button
                    icon={<Trash2 />}
                    color="error"
                    {...tooltip('Supprimer')}
                    onClick={() => handleDelete(g)}
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
