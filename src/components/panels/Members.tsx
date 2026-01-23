import { by, Css } from 'fluxio';
import { toNumber, toString } from 'fluxio';
import { Trash2Icon } from 'lucide-react';
import { Grid, GridCols } from '@/components/common/Grid';
import { Field } from '@/components/fields/Field';
import { Button } from '@/components/common/Button';
import { api2, MMember } from '@/api2';
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
      <Field type="text" value={desc} onValue={async (desc) => api2.members.update(id, { desc })} />
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
        }}
      />
    ),
    { w: 120, cls: c('Actions') },
  ],
};

export const Members = () => {
  const members = useFlux(api2.members.items$);

  if (!members) return;

  const filteredMembers = members.filter(m => !m.deviceId);

  return <Grid {...c('')} cols={cols} items={filteredMembers} ctx={{}} />;
};
