import { Plus } from 'lucide-react';
import { computeStyle, Css } from 'fluxio';
import { SearchField } from '../components/SearchField';
import { GroupGrid } from '../components/GroupGrid';
import { tooltip } from '@/components/Tooltip';
import { Role } from '@/api/models';
import { Page, PageBody } from '@/components/Page';
import { Toolbar } from '@/components/Toolbar';
import { Button } from '@/components/Button';
import { useApi } from '@/hooks/apiHooks';

const c = Css('GroupsPage', {
  Color: {
    h: 1,
    w: 8,
    bg: 'red',
  },
});

export const Color = ({ color }: { color: string }) => (
  <div {...tooltip(color)} {...c('Color')} style={computeStyle({ bg: color }) as any} />
);

export const GroupsPage = () => {
  const api = useApi();
  const handleAdd = async () => {
    const auth = api.pb.getAuth();
    if (!auth) return;
    const group = await api.group.create({ name: 'Nouveau Groupe', user: auth.id });
    if (group) {
      const role = Role.viewer;
      await api.member.create({ user: auth.id, group: group.id, role });
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
