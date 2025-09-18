import { useCss, useMsg } from '@common/hooks';
import { Plus, Trash2 } from 'lucide-react';
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
import { Css } from '@common/ui';
import { SearchField } from '../components/SearchField';
import { Role } from '@common/api/models';
import { group$, isAdvanced$, useGroup } from '../messages';
import { auth$ } from '@common/api/messages';
import { collGroups } from '@common/api/collGroups';
import { collMembers } from '@common/api/collMembers';
import { useSyncColl } from '@common/hooks/useSyncColl';
import { syncGroups } from '@common/api/syncGroups';

const css: Css = {};

export const GroupsPage = () => {
  const c = useCss('GroupsPage', css);
  const auth = useMsg(auth$);
  const group = useGroup();
  const isAdvanced = useMsg(isAdvanced$);
  const groups = useSyncColl(syncGroups);

  const handleAdd = async () => {
    if (!auth) return;
    const group = await collGroups
      .create({ name: 'Nouveau Groupe', user: auth.id })
      .catch(showError);
    if (group) {
      await collMembers
        .create({
          user: auth.id,
          group: group.id,
          role: Role.viewer,
        })
        .catch(showError);
    }
  };

  console.debug('GroupsPage', { c, auth, group, isAdvanced, groups });

  return (
    <Page cls={c}>
      <PageHeader title="Gestionnaire de groupes">
        <Button title="Ajouter" icon={<Plus />} color="primary" onClick={handleAdd} />
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
            {groups.map((g, i) => (
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
                      onValue={(key) => syncGroups.update(g, { key })}
                    />
                  </Cell>
                )}
                <Cell>
                  <Field value={g.name} onValue={(name) => syncGroups.update(g, { name })} />
                </Cell>
                <Cell variant="row">
                  <Button
                    icon={<Trash2 />}
                    color="error"
                    {...tooltip('Supprimer')}
                    onClick={() => syncGroups.delete(g)}
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
