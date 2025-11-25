import { PlusIcon, UsersIcon } from 'lucide-react';
import { useApi, useGroups } from '@/hooks/useApi';
import { Field } from '@/components/fields/Field';
import { Button } from '@/components/common/Button';
import { Panel } from './base/Panel';
import { Css } from 'fluxio';
import { useRouteController, useGroupKey } from '@/hooks/useRoute';
import { Role } from '@/api/models';

const c = Css('GroupPanel', {
  '': {
    flex: 2,
  },
  Groups: {
    row: ['center', 'around'],
    flexWrap: 'wrap',
    p: 8,
  },
  GroupButton: {
    m: 8,
  },
  'GroupButton .FieldLabel': {
    w: 55,
  },
  GroupButtonContent: {
    m: 16,
    col: ['center', 'center'],
  },
  'Group-selected': {},
  AddButton: {
    m: 8,
  },
  AddButtonContent: {
    m: 16,
    col: ['center', 'center'],
  },
});

// const cols: GridCols<
//   GroupModel,
//   {
//     groupKey: string;
//     isAdvanced: boolean;
//     api: Api;
//   }
// > = {
//   selected: [
//     'Sélectionné',
//     (item, ctx) => (
//       <Field
//         type="switch"
//         value={item.key === ctx.groupKey}
//         onValue={(v) => setGroupKey(v ? item.key : '')}
//       />
//     ),
//     { w: 240 },
//   ],
//   key: [
//     'Clé',
//     (item, { api }) => (
//       <Button tooltip={item.id}>
//         <Field
//           value={item.key}
//           onValue={(key) => api.group.update(item.id, { key })}
//         />
//       </Button>
//     ),
//     { if: (_, { isAdvanced }) => isAdvanced },
//   ],
//   name: [
//     'Nom',
//     (item, { api }) => (
//       <Field value={item.name} onValue={(name) => api.group.update(item.id, { name })} />
//     ),
//   ],
//   isDark: [
//     'Mode sombre',
//     (item, { api }) => (
//       <Field
//         type="switch"
//         value={item.data?.isDark}
//         onValue={(isDark) => {
//           api.group.apply(item.id, (prev) => {
//             prev.data = { ...prev.data, isDark };
//           });
//         }}
//       />
//     ),
//   ],
//   primary: [
//     'Couleur primaire',
//     (item, { api }) => (
//       <Field
//         type="color"
//         value={item.data?.primary}
//         onValue={(primary) => {
//           api.group.apply(item.id, (prev) => {
//             prev.data = { ...prev.data, primary };
//           });
//         }}
//       />
//     ),
//   ],
//   secondary: [
//     'Couleur secondaire',
//     (item, { api }) => (
//       <Field
//         type="color"
//         value={item.data?.secondary}
//         onValue={(secondary) => {
//           api.group.apply(item.id, (prev) => {
//             prev.data = { ...prev.data, secondary };
//           });
//         }}
//       />
//     ),
//   ],
//   actions: [
//     'Actions',
//     (item, { api }) => (
//       <Button
//         icon={Trash2}
//         color="error"
//         tooltip="Supprimer"
//         onClick={() => api.group.delete(item.id)}
//       />
//     ),
//     { w: 240 },
//   ],
// };

// const GroupGrid = () => {
//   const api = useApi();
//   const groups = useGroups();
//   const groupKey = useGroupKey();
//   const isAdvanced = useIsAdvanced();
//   console.debug('GroupGrid', { groups, groupKey, isAdvanced });
//   return <Grid ctx={{ groupKey, isAdvanced, api }} cols={cols} items={groups} />;
// }

export const GroupPanel = () => {
  const api = useApi();
  const groups = useGroups();
  const groupKey = useGroupKey();
  const routeController = useRouteController();

  const handleAdd = async () => {
    const auth = api.pb.getAuth();
    if (!auth) return;
    const group = await api.group.create({ name: 'Nouveau Groupe', user: auth.id });
    if (group) {
      const role = Role.viewer;
      await api.member.create({ user: auth.id, group: group.id, role });
    }
  };

  console.debug('GroupPanel', { groups, groupKey });

  return (
    <Panel icon={UsersIcon} title="Mes Groups" {...c('')}>
      <div {...c('Groups')}>
        {groups.map((group) => (
          <Button
            {...c('GroupButton')}
            selected={group.key === groupKey}
            onClick={() => routeController.go({ group: group.key })}
          >
            <div {...c('GroupButtonContent')}>
              <Field
                label="Clé"
                value={group.key}
                onValue={(key) => {
                  api.group.update(group.id, { key });
                }}
              />
              <Field
                label="Nom"
                value={group.name}
                onValue={(name) => {
                  api.group.update(group.id, { name });
                }}
              />
              <Field
                type="color"
                value={group.data?.primary}
                onValue={(primary) => {
                  api.group.apply(group.id, (prev) => {
                    prev.data = { ...prev.data, primary };
                  });
                }}
              />
              <Field
                type="color"
                value={group.data?.secondary}
                onValue={(secondary) => {
                  api.group.apply(group.id, (prev) => {
                    prev.data = { ...prev.data, secondary };
                  });
                }}
              />
            </div>
          </Button>
        ))}
        <Button {...c('AddButton')} onClick={handleAdd} color="secondary">
          <div {...c('AddButtonContent')}>
            <PlusIcon />
            <div>Ajouter</div>
          </div>
        </Button>
      </div>
      {/* <GroupGrid /> */}
    </Panel>
  );
};
