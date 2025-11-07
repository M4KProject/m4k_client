import { Trash2 } from 'lucide-react';
import { Grid, GridCols } from '@/components/Grid';
import { groupSync } from '@/api/sync';
import { setGroupKey } from '@/router/setters';
import { useGroupKey, useIsAdvanced } from '@/router/hooks';
import { useGroups } from '@/api/hooks';
import { GroupModel } from '@/api/models';
import { Field } from '@/components/Field';
import { tooltip } from '@/components/Tooltip';
import { Button } from '@/components/Button';

const cols: GridCols<
  GroupModel,
  {
    groupKey: string;
    isAdvanced: boolean;
  }
> = {
  selected: [
    'Sélectionné',
    (item, ctx) => (
      <Field
        type="switch"
        value={item.key === ctx.groupKey}
        onValue={(v) => setGroupKey(v ? item.key : '')}
      />
    ),
    { w: 240 },
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
    { if: (_, { isAdvanced }) => isAdvanced },
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
    { w: 240 },
  ],
};

export interface GroupGridProps {}

export const GroupGrid = (_: GroupGridProps) => {
  const groups = useGroups();
  const groupKey = useGroupKey();
  const isAdvanced = useIsAdvanced();
  console.debug('GroupGrid', { groups, groupKey, isAdvanced });
  return <Grid ctx={{ groupKey, isAdvanced }} cols={cols} items={groups} />;
};
