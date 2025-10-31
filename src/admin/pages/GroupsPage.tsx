import { Plus } from 'lucide-react';
import { Button, Page, Toolbar, PageBody, tooltip } from '@common/components';
import { Css, getColor } from '@common/ui';
import { SearchField } from '../components/SearchField';
import { Role } from '@/api';
import { groupSync, memberSync } from '@/api/sync';
import { GroupGrid } from '../components/GroupGrid';
import { getPbClient } from 'pocketbase-lite';

const c = Css('GroupsPage', {
  Color: {
    h: 1,
    w: 1,
    bg: 'red',
  },
});

export const Color = ({ color }: { color: string }) => (
  <div {...tooltip(color)} {...c('Color')} style={{ background: getColor(color) }} />
);

export const GroupsPage = () => {
  const handleAdd = async () => {
    const auth = getPbClient().getAuth();
    if (!auth) return;
    const group = await groupSync.create({ name: 'Nouveau Groupe', user: auth.id });
    if (group) {
      const role = Role.viewer;
      await memberSync.create({ user: auth.id, group: group.id, role });
    }
  };

  console.debug('GroupsPage');

  return (
    <Page {...c()}>
      <Toolbar title="Gestionnaire de groupes">
        <Button title="Ajouter" icon={<Plus />} color="primary" onClick={handleAdd} />
        <SearchField />
      </Toolbar>
      <PageBody>
        <GroupGrid />
      </PageBody>
    </Page>
  );
};
