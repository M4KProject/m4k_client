import { useMsg } from '@common/hooks';
import { Plus } from 'lucide-react';
import { Button, Page, Toolbar, PageBody, tooltip } from '@common/components';
import { Css, getColor } from '@common/ui';
import { SearchField } from '../components/SearchField';
import { Role, apiAuth$ } from '@common/api';
import { groupSync, memberSync } from '@/api/sync';
import { useIsAdvanced } from '@/router/hooks';
import { useGroup, useGroups } from '@/api/hooks';
import { GroupGrid } from '../components/GroupGrid';

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

  return (
    <Page class={c()}>
      <Toolbar title="Gestionnaire de groupes">
        <Button title="Ajouter" icon={<Plus />} color="primary" onClick={handleAdd} />
        <SearchField />
      </Toolbar>
      <PageBody>
        <GroupGrid groups={groups} groupId={groupId} isAdvanced={isAdvanced} />
      </PageBody>
    </Page>
  );
};
