import { Css } from '@common/ui';
import { Dictionary, toNumber, toString } from 'fluxio';
import { Field, Button, tooltip, GridCols, Grid } from '@common/components';
import { Trash2 } from 'lucide-react';
import { memberSync } from '@/api/sync';
import { useDeviceById, useGroupMembers } from '@/api/hooks';
import { DeviceModel, MemberModel } from '@/api';

const c = Css('MemberGrid', {});

const cols: GridCols<MemberModel, { deviceById: Dictionary<DeviceModel> }> = {
  id: ['Appareil', ({ device }) => <Field type="switch" value={!!device} readonly />, { w: 10 }],
  name: [
    'Email',
    ({ device, email }, { deviceById }) => (device ? deviceById[device]?.name : email),
    { w: 100 },
  ],
  desc: [
    'Description',
    ({ id, desc }) => (
      <Field type="text" value={desc} onValue={(desc) => memberSync.update(id, { desc })} />
    ),
    { w: 100 },
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
    { w: 50 },
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
    { w: 20 },
  ],
};

export const MemberGrid = () => {
  const members = useGroupMembers();
  const deviceById = useDeviceById();

  return <Grid class={c()} cols={cols} items={members} ctx={{ deviceById }} />;
};
