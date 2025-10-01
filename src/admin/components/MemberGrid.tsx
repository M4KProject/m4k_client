import { Css } from '@common/ui';
import { byId, TMap, toNbr, toStr } from '@common/utils';
import { Field, Button, tooltip, GridCols, Grid } from '@common/components';
import { Trash2 } from 'lucide-react';
import { memberSync } from '@/api/sync';
import { useDeviceById, useDevices, useMembers } from '@/api/hooks';
import { DeviceModel, MemberModel } from '@common/api';

const c = Css('MemberGrid', {});

const cols: GridCols<MemberModel, { deviceById: TMap<DeviceModel> }> = {
  id: {
    w: 10,
    title: 'Appareil',
    val: ({ device }) => <Field type="switch" value={!!device} readonly />,
  },
  name: {
    w: 100,
    title: 'Email',
    val: ({ device, email }, { deviceById }) => (device ? deviceById[device]?.name : email),
  },
  desc: {
    w: 100,
    title: 'Description',
    val: ({ id, desc }) => (
      <Field type="text" value={desc} onValue={(desc) => memberSync.update(id, { desc })} />
    ),
  },
  role: {
    w: 50,
    title: 'Droit',
    val: ({ id, role }) => (
      <Field
        type="select"
        items={[
          ['10', 'Lire'],
          ['20', 'Lire et Écrire'],
          ['30', 'Administrateur'],
        ]}
        value={toStr(role)}
        onValue={(role) => memberSync.update(id, { role: toNbr(role) })}
      />
    ),
  },
  actions: {
    w: 20,
    title: 'Actions',
    val: ({ id }) => (
      <Button
        icon={<Trash2 />}
        color="error"
        {...tooltip('Supprimer')}
        onClick={() => memberSync.delete(id)}
      />
    ),
  },
};

export const MemberGrid = () => {
  const members = useMembers();
  const deviceById = useDeviceById();

  return <Grid class={c()} cols={cols} items={members} ctx={{ deviceById }} />;
};
