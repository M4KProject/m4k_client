import { Css } from 'fluxio';
import { toNumber, toString } from 'fluxio';
import { Trash2Icon } from 'lucide-react';
import { Grid, GridCols } from '@/components/common/Grid';
import { Field } from '@/components/fields/Field';
import { Button } from '@/components/common/Button';
import { api2, MMember } from '@/api2';
import { useEffect } from 'preact/hooks';
import { useFlux } from '@/hooks/useFlux';

const c = Css('Members', {
  Actions: {
    row: ['center', 'center'],
  },
});

const cols: GridCols<MMember> = {
  // id: ['Appareil', ({ devickId }) => <Field type="switch" value={deviceId} readonly />, { w: 50 }],
  name: ['Email', ({ email }) => email],
  desc: [
    'Description',
    ({ id, desc }) => (
      <Field type="text" value={desc} onValue={async (desc) => {
        await api2.members.update(id, { desc });
        api2.members.refresh();
      }} />
    ),
  ],
  role: [
    'Droit',
    ({ id, role }) => (
      <Field
        type="select"
        items={[
          ['10', 'Lire'],
          ['20', 'Lire et Écrire'],
          ['30', 'Administrateur'],
        ]}
        value={toString(role)}
        onValue={async (role) => {
          await api2.members.update(id, { role: toNumber(role) });
          api2.members.refresh();
        }}
      />
    ),
    { w: 140 },
  ],
  actions: [
    'Actions',
    ({ id }) => (
      <Button
        icon={Trash2Icon}
        color="error"
        tooltip="Supprimer"
        onClick={async () => {
          await api2.members.remove(id);
          api2.members.refresh();
        }}
      />
    ),
    { w: 120, cls: c('Actions') },
  ],
};

export const Members = () => {
  const allMembers = useFlux(api2.members.items$);
  useEffect(() => api2.members.refresh(), []);

  if (!allMembers) return;

  const members = allMembers.filter(m => !m.deviceId);

  return <Grid {...c('')} cols={cols} items={members} ctx={{}} />;
};
