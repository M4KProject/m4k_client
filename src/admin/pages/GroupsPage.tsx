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
import { Role, apiAuth$ } from '@common/api';
import { groupSync, memberSync } from '@/api/sync';
import { useIsAdvanced } from '@/router/hooks';
import { setGroupKey } from '@/router/setters';
import { useGroup, useGroups } from '@/api/hooks';

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
  const auth = useMsg(apiAuth$);
  const group = useGroup();
  const groups = useGroups();
  const isAdvanced = useIsAdvanced();

  const handleAdd = async () => {
    if (!auth) return;
    const group = await groupSync.create({ name: 'Nouveau Groupe', user: auth.id });
    if (group) {
      const role = Role.viewer;
      await memberSync.create({ user: auth.id, group: group.id, role });
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
                    value={g.id === group.id}
                    onValue={(v) => setGroupKey(v ? g.key : '')}
                  />
                </Cell>
                {isAdvanced && (
                  <Cell>
                    <Field
                      {...tooltip(g.id)}
                      value={g.key}
                      onValue={(key) => groupSync.update(g.id, { key })}
                    />
                  </Cell>
                )}
                <Cell>
                  <Field value={g.name} onValue={(name) => groupSync.update(g.id, { name })} />
                </Cell>
                <Cell>
                  <Field
                    type="switch"
                    value={g.data?.isDark}
                    onValue={(isDark) => {
                      groupSync.apply(g.id, (prev) => {
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
                      groupSync.apply(g.id, (prev) => {
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
                      groupSync.apply(g.id, (prev) => {
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
                    onClick={() => groupSync.delete(g.id)}
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
