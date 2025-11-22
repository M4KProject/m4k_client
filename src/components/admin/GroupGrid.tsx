import { Trash2 } from 'lucide-react';
import { Grid, GridCols } from '@/components/Grid';
import { setGroupKey } from '@/router/setters';
import { useGroupKey, useIsAdvanced } from '@/router/hooks';
import { useApi, useGroups } from '@/hooks/apiHooks';
import { GroupModel } from '@/api/models';
import { Field } from '@/components/Field';
import { Button } from '@/components/Button';
import { Api } from '@/api/Api';

const cols: GridCols<
  GroupModel,
  {
    groupKey: string;
    isAdvanced: boolean;
    api: Api;
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
    (item, { api }) => (
      <Button tooltip={item.id}>
        <Field
          value={item.key}
          onValue={(key) => api.group.update(item.id, { key })}
        />
      </Button>
    ),
    { if: (_, { isAdvanced }) => isAdvanced },
  ],
  name: [
    'Nom',
    (item, { api }) => (
      <Field value={item.name} onValue={(name) => api.group.update(item.id, { name })} />
    ),
  ],
  isDark: [
    'Mode sombre',
    (item, { api }) => (
      <Field
        type="switch"
        value={item.data?.isDark}
        onValue={(isDark) => {
          api.group.apply(item.id, (prev) => {
            prev.data = { ...prev.data, isDark };
          });
        }}
      />
    ),
  ],
  primary: [
    'Couleur primaire',
    (item, { api }) => (
      <Field
        type="color"
        value={item.data?.primary}
        onValue={(primary) => {
          api.group.apply(item.id, (prev) => {
            prev.data = { ...prev.data, primary };
          });
        }}
      />
    ),
  ],
  secondary: [
    'Couleur secondaire',
    (item, { api }) => (
      <Field
        type="color"
        value={item.data?.secondary}
        onValue={(secondary) => {
          api.group.apply(item.id, (prev) => {
            prev.data = { ...prev.data, secondary };
          });
        }}
      />
    ),
  ],
  actions: [
    'Actions',
    (item, { api }) => (
      <Button
        icon={Trash2}
        color="error"
        tooltip="Supprimer"
        onClick={() => api.group.delete(item.id)}
      />
    ),
    { w: 240 },
  ],
};

export interface GroupGridProps {}

export const GroupGrid = (_: GroupGridProps) => {
  const api = useApi();
  const groups = useGroups();
  const groupKey = useGroupKey();
  const isAdvanced = useIsAdvanced();
  console.debug('GroupGrid', { groups, groupKey, isAdvanced });
  return <Grid ctx={{ groupKey, isAdvanced, api }} cols={cols} items={groups} />;
};
