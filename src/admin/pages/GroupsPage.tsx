import { useMsg } from '@common/hooks';
import { Plus, Trash2 } from 'lucide-react';
import {
  Field,
  Button,
  Page,
  Toolbar,
  PageBody,
  tooltip,
  Grid,
  GridCols,
} from '@common/components';
import { Css, getColor } from '@common/ui';
import { SearchField } from '../components/SearchField';
import { GroupModel, Role, apiAuth$ } from '@common/api';
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

const getCols = (isAdvanced: boolean): GridCols<GroupModel, { groupId: string }> => ({
  selected: {
    w: 30,
    title: 'Sélectionné',
    val: (item, ctx) => (
      <Field
        type="switch"
        value={item.id === ctx.groupId}
        onValue={(v) => setGroupKey(v ? item.key : '')}
      />
    ),
  },
  key: isAdvanced && ({
    title: 'Clé',
    val: (item) => (
      <Field
        {...tooltip(item.id)}
        value={item.key}
        onValue={(key) => groupSync.update(item.id, { key })}
      />
    ),
  }),
  name: {
    title: 'Nom',
    val: (item) => (
      <Field value={item.name} onValue={(name) => groupSync.update(item.id, { name })} />
    ),
  },
  isDark: {
    title: 'Mode sombre',
    val: (item) => (
      <Field
        type="switch"
        value={item.data?.isDark}
        onValue={(isDark) => {
          groupSync.apply(item.id, (prev) => {
            prev.data = { ...prev.data, isDark };
          });
        }}
      />
    ),
  },
  primary: {
    title: 'Couleur primaire',
    val: (item) => (
      <Field
        type="color"
        value={item.data?.primary}
        onValue={(primary) => {
          groupSync.apply(item.id, (prev) => {
            prev.data = { ...prev.data, primary };
          });
        }}
      />
    ),
  },
  secondary: {
    title: 'Couleur secondaire',
    val: (item) => (
      <Field
        type="color"
        value={item.data?.secondary}
        onValue={(secondary) => {
          groupSync.apply(item.id, (prev) => {
            prev.data = { ...prev.data, secondary };
          });
        }}
      />
    ),
  },
  actions: {
    w: 30,
    title: 'Actions',
    variant: 'actions',
    val: (item) => (
      <Button
        icon={<Trash2 />}
        color="error"
        {...tooltip('Supprimer')}
        onClick={() => groupSync.delete(item.id)}
      />
    ),
  },
});

const basicCols = getCols(false);
const advancedCols = getCols(true);

export const GroupsPage = () => {
  const auth = useMsg(apiAuth$);
  const group = useGroup();
  const groupId = group?.id;
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

  const cols = isAdvanced ? advancedCols : basicCols;

  return (
    <Page class={c()}>
      <Toolbar title="Gestionnaire de groupes">
        <Button title="Ajouter" icon={<Plus />} color="primary" onClick={handleAdd} />
        <SearchField />
      </Toolbar>
      <PageBody>
        <Grid ctx={{ groupId }} cols={cols} items={groups} />
      </PageBody>
    </Page>
  );
};
