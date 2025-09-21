import { useMsg } from '@common/hooks';
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
import { group$, isAdvanced$, useGroup } from '../messages';
import { Role, auth$, collSync } from '@common/api';
import { useQuery } from '@common/hooks/useQuery';
import { groupCtrl, memberCtrl } from '../controllers';

const css = Css('GroupsPage', {});

export const GroupsPage = () => {
  const auth = useMsg(auth$);
  const group = useGroup();
  const isAdvanced = useMsg(isAdvanced$);
  const groups = useQuery(groupCtrl);

  const handleAdd = async () => {
    if (!auth) return;
    const group = await groupCtrl.create({ name: 'Nouveau Groupe', user: auth.id });
    if (group) {
      const role = Role.viewer;
      await memberCtrl.create({ user: auth.id, group: group.id, role });
    }
  };

  console.debug('GroupsPage', { auth, group, isAdvanced, groups });

  return (
    <Page  cls={css()}>
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
                      onValue={(key) => groupCtrl.update(g, { key })}
                    />
                  </Cell>
                )}
                <Cell>
                  <Field value={g.name} onValue={(name) => groupCtrl.update(g.id, { name })} />
                </Cell>
                <Cell variant="row">
                  <Button
                    icon={<Trash2 />}
                    color="error"
                    {...tooltip('Supprimer')}
                    onClick={() => groupCtrl.delete(g.id)}
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
