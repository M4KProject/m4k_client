import { Css } from 'fluxio';
import { Dictionary, toNumber, toString } from 'fluxio';
import { Trash2Icon } from 'lucide-react';
import { Grid, GridCols } from '@/components/common/Grid';
import { useApi, useDeviceById, useMembers } from '@/hooks/useApi';
import { Field } from '@/components/fields/Field';
import { Button } from '@/components/common/Button';
import { Api } from '@/api/Api';
import { Device, Member } from '@/api/models';

const c = Css('Members', {
  Actions: {
    row: ['center', 'center'],
  },
});

const cols: GridCols<Member, { deviceById: Dictionary<Device>; api: Api }> = {
  id: ['Appareil', ({ device }) => <Field type="switch" value={!!device} readonly />, { w: 50 }],
  name: [
    'Email',
    ({ device, email }, { deviceById }) => (device ? deviceById[device]?.name : email),
  ],
  desc: [
    'Description',
    ({ id, desc }, { api }) => (
      <Field type="text" value={desc} onValue={(desc) => api.members.update(id, { desc })} />
    ),
  ],
  role: [
    'Droit',
    ({ id, role }, { api }) => (
      <Field
        type="select"
        items={[
          ['10', 'Lire'],
          ['20', 'Lire et Écrire'],
          ['30', 'Administrateur'],
        ]}
        value={toString(role)}
        onValue={(role) => api.members.update(id, { role: toNumber(role) })}
      />
    ),
    { w: 140 },
  ],
  actions: [
    'Actions',
    ({ id }, { api }) => (
      <Button
        icon={Trash2Icon}
        color="error"
        tooltip="Supprimer"
        onClick={() => api.members.remove(id)}
      />
    ),
    { w: 120, cls: c('Actions') },
  ],
};

export const Members = () => {
  const api = useApi();
  const members = useMembers();
  const deviceById = useDeviceById();

  return <Grid {...c('')} cols={cols} items={members} ctx={{ deviceById, api }} />;
};
