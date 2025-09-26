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
import { Css, getColor } from '@common/ui';
import { SearchField } from '../components/SearchField';
import { Role, auth$ } from '@common/api';
import { groupCtrl, memberCtrl } from '../controllers';
import { setGroupKey, useGroupKey, useIsAdvanced } from '../controllers/router';
import { useItem, useItems } from '../controllers/useItem';

const c = Css('GroupsPage', {
  Color: {
    h: 1,
    w: 1,
    bg: 'red',
  },
});

export const Color = ({ color }: { color: string }) => (
  <div {...tooltip(color)} class={c('Color')} style={{ background: getColor(color) }} />
);

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
              <CellHead>Mode sombre</CellHead>
              <CellHead>Couleur primaire</CellHead>
              <CellHead>Couleur secondaire</CellHead>
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
                    value={g.key === groupKey || g.id === groupKey}
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
                <Cell>
                  <Field
                    type="switch"
                    value={g.data?.isDark}
                    onValue={(isDark) => {
                      groupCtrl.apply(g.id, (prev) => {
                        prev.data = { ...prev.data, isDark };
                      });
                    }}
                  />
                </Cell>
                <Cell>
                  <Field
                    type="color"
                    value={g.data?.primary}
                    onValue={(primary) => {
                      groupCtrl.apply(g.id, (prev) => {
                        prev.data = { ...prev.data, primary };
                      });
                    }}
                  />
                </Cell>
                <Cell>
                  <Field
                    type="color"
                    value={g.data?.secondary}
                    onValue={(secondary) => {
                      groupCtrl.apply(g.id, (prev) => {
                        prev.data = { ...prev.data, secondary };
                      });
                    }}
                  />
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
