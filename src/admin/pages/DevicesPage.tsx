import { Css } from '@common/ui';
import {
  formatDate,
  formatDateTime,
  isSearched,
  stringify,
  toDate,
  toErr,
  toTime,
} from '@common/utils';
import { useAsync, useCss, useMsg } from '@common/hooks';
import { search$ } from '../messages/search$';
import { groupId$ } from '@common/api/messages';
import { openDevice } from '../controllers/Router';
import {
  Button,
  Field,
  Page,
  PageHeader,
  PageBody,
  Table,
  Cell,
  CellHeader,
  Row,
  TableBody,
  TableHead,
  tooltip,
  showDialog,
  Form,
} from '@common/components';
import { RefreshCw, Trash2, Settings, Plus, Power } from 'lucide-react';
import { SearchField } from '../components/SearchField';
import { isAdvanced$ } from '../messages';
import { useState } from 'preact/hooks';
import { apiGet } from '@common/api/call';
import { collGroups } from '@common/api/collGroups';
import { collMedias } from '@common/api/collMedias';
import { collDevices } from '@common/api/collDevices';
import { serverTime } from '@common/api/serverTime';
import { DeviceModel, ModelUpdate, Role } from '@common/api/models';
import { collMembers } from '@common/api/collMembers';

const css: Css = {};

export const PairingForm = ({ onClose }: { onClose: () => void }) => {
  const [key, setKey] = useState('');
  const group = useMsg(groupId$);

  const handlePairing = async () => {
    if (!key) return;

    try {
      console.log('Tentative de pairage avec le code:', key);
      await apiGet(`pair/${key}/${group}`);
      onClose();
    } catch (e) {
      const error = toErr(e);
      console.error('Erreur lors du pairage:', error);
      alert('Erreur lors du pairage. Vérifiez le code et réessayez.');
      onClose();
    }
  };

  return (
    <Form>
      <Field label="Code de pairage" value={key} onValue={setKey} />
      <Button title="Pairer l'écran" color="primary" onClick={handlePairing} />
    </Form>
  );
};

export const DevicesPage = () => {
  const c = useCss('DevicesPage', css);
  const search = useMsg(search$);
  const groupId = useMsg(groupId$);
  const isAdvanced = useMsg(isAdvanced$);

  const [groups, groupsRefresh] = useAsync([], () => collGroups.find({}));

  const [medias, mediasRefresh] = useAsync(
    [],
    () => collMedias.find({ group: groupId }),
    'medias',
    [groupId]
  );

  const [devices, devicesRefresh] = useAsync(
    [],
    () => collDevices.find(groupId ? { group: groupId } : {}),
    'devices',
    [groupId]
  );

  const filteredDevices = search ? devices.filter((d) => isSearched(d.name, search)) : devices;

  const onlineMin = serverTime() - 10 * 1000;

  const handleAdd = async () => {
    showDialog('Pairer un nouvel écran', (open$) => {
      return (
        <PairingForm
          onClose={() => {
            open$.set(false);
            devicesRefresh();
          }}
        />
      );
    });
  };

  const handleUpdate = async (device: DeviceModel, changes: ModelUpdate<DeviceModel>) => {
    await collDevices.update(device.id, changes);
    await groupsRefresh();
    await devicesRefresh();
    await mediasRefresh();
  };

  const handleDelete = (device: DeviceModel) => collDevices.delete(device.id);

  const handleRemote = (device: DeviceModel) => {
    openDevice(device.key || device.id);
  };

  const handleAddAsMember = async (device: DeviceModel) => {
    if (!device.user || !groupId) return;
    await collMembers.create({
      user: device.user,
      group: groupId,
      role: Role.viewer,
    });
  };

  return (
    <Page cls={c}>
      <PageHeader title="Les écrans">
        {isAdvanced && (
          <Button icon={<Plus />} color="primary" onClick={handleAdd}>
            Ajouter
          </Button>
        )}
        <Button icon={<RefreshCw />} color="primary" onClick={devicesRefresh}>
          Rafraîchir
        </Button>
        <SearchField />
      </PageHeader>
      <PageBody>
        <Table>
          <TableHead>
            <Row>
              {isAdvanced && <CellHeader>Groupe</CellHeader>}
              {isAdvanced && <CellHeader>Clé</CellHeader>}
              {isAdvanced && <CellHeader>Type</CellHeader>}
              <CellHeader>Nom</CellHeader>
              <CellHeader>Résolution</CellHeader>
              <CellHeader>Online</CellHeader>
              <CellHeader>Création</CellHeader>
              <CellHeader>Média</CellHeader>
              <CellHeader>Actions</CellHeader>
            </Row>
          </TableHead>
          <TableBody>
            {filteredDevices.map((d) => (
              <Row key={d.id}>
                {isAdvanced && (
                  <Cell>
                    <Field
                      type="select"
                      items={groups.map((g) => [g.id, g.name])}
                      value={d.group}
                      onValue={(group) => handleUpdate(d, { group })}
                    />
                  </Cell>
                )}
                {isAdvanced && (
                  <Cell>
                    <Field
                      {...tooltip(d.id)}
                      value={d.key}
                      onValue={(key) => handleUpdate(d, { key })}
                    />
                  </Cell>
                )}
                {isAdvanced && (
                  <Cell>
                    <Field
                      {...tooltip(() => stringify(d.info, null, 2))}
                      value={`${d.info?.type || ''} ${d.info?.version || ''}`}
                      readonly
                    />
                  </Cell>
                )}
                <Cell>
                  <Field value={d.name} onValue={(name) => handleUpdate(d, { name })} />
                </Cell>
                <Cell>{`${d.info?.width || 0}x${d.info?.height || 0}`}</Cell>
                <Cell>
                  <Field
                    {...tooltip(formatDateTime(toDate(d.online)))}
                    type="switch"
                    value={d.online && toTime(d.online) > onlineMin}
                    readonly
                  />
                </Cell>
                {/* {isAdvanced && <Cell>{formatDateTime(d.created)}</Cell>} */}
                <Cell>{formatDate(d.created)}</Cell>
                <Cell>
                  <Field
                    type="select"
                    items={medias.map((c) => [c.id, c.title || c.key || c.id])}
                    value={d.media}
                    onValue={(media) => handleUpdate(d, { media })}
                  />
                </Cell>
                <Cell variant="around">
                  <Button
                    icon={<RefreshCw />}
                    color="primary"
                    {...tooltip('Rafraîchir')}
                    onClick={() => collDevices.update(d.id, { action: 'reload' })}
                  />
                  <Button
                    icon={<Power />}
                    color="primary"
                    {...tooltip('Redémarrer')}
                    onClick={() => collDevices.update(d.id, { action: 'reboot' })}
                  />
                  {isAdvanced && (
                    <Button
                      icon={<Settings />}
                      {...tooltip('Mode remote')}
                      onClick={() => handleRemote(d)}
                    />
                  )}
                  {isAdvanced && (
                    <Button
                      icon={<Trash2 />}
                      color="error"
                      {...tooltip('Supprimer')}
                      onClick={() => handleDelete(d)}
                    />
                  )}
                </Cell>
              </Row>
            ))}
          </TableBody>
        </Table>
      </PageBody>
    </Page>
  );
};
