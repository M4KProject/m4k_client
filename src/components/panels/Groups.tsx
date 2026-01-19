import { PlusIcon, UsersIcon } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Panel } from './base/Panel';
import { Css } from 'fluxio';
import { Group } from './Group';
import { api2 } from '@/api2';
import { useFlux } from '@/hooks/useFlux';

const c = Css('Groups', {
  '': {
    wMin: 350,
    flex: 3,
  },
  AddButton: {
    m: 8,
  },
});

export const Groups = () => {
  const groups = useFlux(api2.groups.items$);

  const handleAdd = async () => {
    const group = await api2.groups.create({ name: 'Nouveau Groupe' });
    await api2.setGroupId(group);
  };

  console.debug('Groups', { groups });

  return (
    <Panel icon={UsersIcon} header="Mes Groupes" {...c('')}>
      {(groups||[]).map((group) => (
        <Group key={group.id} group={group} />
      ))}
      <Button
        {...c('AddButton')}
        icon={PlusIcon}
        onClick={handleAdd}
        color="secondary"
        title="Ajouter un Group"
      />
      {/* <GroupGrid /> */}
    </Panel>
  );
};

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
