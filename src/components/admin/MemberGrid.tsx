import { Css } from 'fluxio';
import { Dictionary, toNumber, toString } from 'fluxio';
import { Trash2 } from 'lucide-react';
import { Grid, GridCols } from '@/components/common/Grid';
import { useApi, useDeviceById, useGroupMembers } from '@/hooks/useApi';
import { DeviceModel, MemberModel } from '@/api/models';
import { Field } from '@/components/fields/Field';
import { Button } from '@/components/common/Button';
import { Api } from '@/api/Api';

const c = Css('MemberGrid', {
  Actions: {
    row: ['center', 'center'],
  },
});

const cols: GridCols<MemberModel, { deviceById: Dictionary<DeviceModel>; api: Api }> = {
  id: ['Appareil', ({ device }) => <Field type="switch" value={!!device} readonly />, { w: 50 }],
  name: [
    'Email',
    ({ device, email }, { deviceById }) => (device ? deviceById[device]?.name : email),
  ],
  desc: [
    'Description',
    ({ id, desc }, { api }) => (
      <Field type="text" value={desc} onValue={(desc) => api.member.update(id, { desc })} />
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
        onValue={(role) => api.member.update(id, { role: toNumber(role) })}
      />
    ),
    { w: 140 },
  ],
  actions: [
    'Actions',
    ({ id }, { api }) => (
      <Button
        icon={Trash2}
        color="error"
        tooltip="Supprimer"
        onClick={() => api.member.delete(id)}
      />
    ),
    { w: 120, cls: c('Actions') },
  ],
};

export const MemberGrid = () => {
  const api = useApi();
  const members = useGroupMembers();
  const deviceById = useDeviceById();

  return <Grid {...c()} cols={cols} items={members} ctx={{ deviceById, api }} />;
};
