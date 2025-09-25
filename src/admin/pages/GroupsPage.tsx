import { useMsg } from '@common/hooks';
import { Plus, Trash2 } from 'lucide-react';
import {
  Field,
  Button,
  Table,
  Cell,
  CellHead,
  Row,
  TableBody,
  TableHead,
  Page,
  Toolbar,
  PageBody,
  tooltip,
  RowHead,
} from '@common/components';
import { Css } from '@common/ui';
import { SearchField } from '../components/SearchField';
import { Role, auth$ } from '@common/api';
import { groupCtrl, memberCtrl } from '../controllers';
import { setGroupKey, useGroupKey, useIsAdvanced } from '../controllers/router';
import { useItem, useItems } from '../controllers/useItem';

const c = Css('GroupsPage', {});

export const GroupsPage = () => {
  const auth = useMsg(auth$);
  const groupKey = useGroupKey();
  const group = useItem(groupCtrl, groupKey);
  const isAdvanced = useIsAdvanced();
  const groups = useItems(groupCtrl);

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
    <Page class={c()}>
      <Toolbar title="Gestionnaire de groupes">
        <Button title="Ajouter" icon={<Plus />} color="primary" onClick={handleAdd} />
        <SearchField />
      </Toolbar>
      <PageBody>
        <Table>
          <TableHead>
            <RowHead>
              <CellHead>Sélectionné</CellHead>
              {isAdvanced && <CellHead>Clé</CellHead>}
              <CellHead>Nom</CellHead>
              <CellHead>Actions</CellHead>
            </RowHead>
          </TableHead>
          <TableBody>
            {groups.map((g, i) => (
              <Row key={g.id}>
                <Cell>
                  <Field
                    name={'C' + i}
                    type="switch"
                    value={group?.id === g.id}
                    onValue={(v) => setGroupKey(v ? g.key : '')}
                  />
                </Cell>
                {isAdvanced && (
                  <Cell>
                    <Field
                      {...tooltip(g.id)}
                      value={g.key}
                      onValue={(key) => groupCtrl.update(g.id, { key })}
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
