import { Field, Button, tooltip, Grid, GridCols } from '@common/components';
import { Trash2 } from 'lucide-react';
import { GroupModel } from '@common/api';
import { groupSync } from '@/api/sync';
import { setGroupKey } from '@/router/setters';

const getGroupCols = (isAdvanced: boolean): GridCols<GroupModel, { groupId: string }> => ({
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
  key: {
    title: 'Clé',
    if: () => isAdvanced,
    val: (item) => (
      <Field
        {...tooltip(item.id)}
        value={item.key}
        onValue={(key) => groupSync.update(item.id, { key })}
      />
    ),
  },
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

export interface GroupGridProps {
  groups: GroupModel[];
  groupId?: string;
  isAdvanced: boolean;
}

export const GroupGrid = ({ groups, groupId, isAdvanced }: GroupGridProps) => {
  const cols = getGroupCols(isAdvanced);

  return <Grid ctx={{ groupId: groupId || '' }} cols={cols} items={groups} />;
};
