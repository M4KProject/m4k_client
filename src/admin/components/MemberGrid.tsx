import { Css } from 'fluxio';
import { Dictionary, toNumber, toString } from 'fluxio';
import { Trash2 } from 'lucide-react';
import { Grid, GridCols } from '@/components/Grid';
import { memberSync } from '@/api/sync';
import { useDeviceById, useGroupMembers } from '@/api/hooks';
import { DeviceModel, MemberModel } from '@/api/models';
import { Field } from '@/components/Field';
import { Button } from '@/components/Button';
import { tooltip } from '@/components/Tooltip';

const c = Css('MemberGrid', {
  Actions: {
    row: ['center', 'center'],
  },
});

const cols: GridCols<MemberModel, { deviceById: Dictionary<DeviceModel> }> = {
  id: ['Appareil', ({ device }) => <Field type="switch" value={!!device} readonly />, { w: 50 }],
  name: [
    'Email',
    ({ device, email }, { deviceById }) => (device ? deviceById[device]?.name : email),
  ],
  desc: [
    'Description',
    ({ id, desc }) => (
      <Field type="text" value={desc} onValue={(desc) => memberSync.update(id, { desc })} />
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
        onValue={(role) => memberSync.update(id, { role: toNumber(role) })}
      />
    ),
    { w: 140 },
  ],
  actions: [
    'Actions',
    ({ id }) => (
      <Button
        icon={<Trash2 />}
        color="error"
        {...tooltip('Supprimer')}
        onClick={() => memberSync.delete(id)}
      />
    ),
    { w: 120, cls: c('Actions') },
  ],
};

export const MemberGrid = () => {
  const members = useGroupMembers();
  const deviceById = useDeviceById();

  return <Grid {...c()} cols={cols} items={members} ctx={{ deviceById }} />;
};
