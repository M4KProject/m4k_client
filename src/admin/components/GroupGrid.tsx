import { Field, Button, tooltip, Grid, GridCols } from '@common/components';
import { Trash2 } from 'lucide-react';
import { GroupModel } from '@common/api';
import { groupSync } from '@/api/sync';
import { setGroupKey } from '@/router/setters';

const getGroupCols = (isAdvanced: boolean): GridCols<GroupModel, { groupId: string }> => ({
  selected: [
    'Sélectionné',
    (item, ctx) => (
      <Field
        type="switch"
        value={item.id === ctx.groupId}
        onValue={(v) => setGroupKey(v ? item.key : '')}
      />
    ),
    { w: 30 },
  ],
  key: [
    'Clé',
    (item) => (
      <Field
        {...tooltip(item.id)}
        value={item.key}
        onValue={(key) => groupSync.update(item.id, { key })}
      />
    ),
    { if: () => isAdvanced },
  ],
  name: [
    'Nom',
    (item) => <Field value={item.name} onValue={(name) => groupSync.update(item.id, { name })} />,
  ],
  isDark: [
    'Mode sombre',
    (item) => (
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
  ],
  primary: [
    'Couleur primaire',
    (item) => (
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
  ],
  secondary: [
    'Couleur secondaire',
    (item) => (
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
  ],
  actions: [
    'Actions',
    (item) => (
      <Button
        icon={<Trash2 />}
        color="error"
        {...tooltip('Supprimer')}
        onClick={() => groupSync.delete(item.id)}
      />
    ),
    { w: 30 },
  ],
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
