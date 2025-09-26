import { Css } from '@common/ui';
import { formatDate, formatDateTime, stringify, toDate, toErr, toTime } from '@common/utils';
import { useMsg } from '@common/hooks';
import {
  Button,
  Field,
  Page,
  Toolbar,
  PageBody,
  Table,
  Cell,
  CellHead,
  Row,
  TableBody,
  TableHead,
  tooltip,
  showDialog,
  Form,
  RowHead,
} from '@common/components';
import { RefreshCw, Trash2, Settings, Plus, Power } from 'lucide-react';
import { useState } from 'preact/hooks';
import { apiGet, serverTime, DeviceModel, groupId$ } from '@common/api';
import { SearchField } from '../components/SearchField';
import { deviceCtrl, mediaCtrl } from '../controllers';
import { useGroupItems } from '../controllers/useItem';
import { setDeviceKey, setPage, useIsAdvanced } from '../controllers/router';

const c = Css('DevicesPage', {
  'Buttons': {
    fRow: ['center', 'space-around'],
  }
});

export const PairingForm = ({ onClose }: { onClose: () => void }) => {
  const [key, setKey] = useState('');
  const group = useMsg(groupId$);

  const handlePairing = async () => {
    if (!key) return;

    const cleanKey = key.toLowerCase().replace(/ /g, '');

    try {
      console.log('Tentative de pairage avec le code:', cleanKey);
      await apiGet(`pair/${cleanKey}/${group}`);
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
      <div class={c('Buttons')}>
        <Button title="Pairer l'écran" color="primary" onClick={handlePairing} />
      </div>
    </Form>
  );
};

export const DevicesPage = () => {
  const isAdvanced = useIsAdvanced();
  const medias = useGroupItems(mediaCtrl);
  const devices = useGroupItems(deviceCtrl);

  // search ? devices.filter((d) => isSearched(d.name, search)) : devices;

  const onlineMin = serverTime() - 10 * 1000;

  const handleAdd = async () => {
    showDialog('Pairer un nouvel écran', (open$) => {
      return <PairingForm onClose={() => open$.set(false)} />;
    });
  };

  const handleRemote = (device: DeviceModel) => {
    setDeviceKey(device.key || device.id);
    setPage('devices');
  };

  // const handleAddAsMember = async (device: DeviceModel) => {
  //   if (!device.user || !groupId) return;
  //   await collMembers.create({
  //     device: device.id,
  //     user: device.user,
  //     group: groupId,
  //     role: Role.viewer,
  //   });
  // };

  return (
    <Page class={c()}>
      <Toolbar title="Les écrans">
        <Button icon={<Plus />} color="primary" onClick={handleAdd}>
          Ajouter
        </Button>
        <SearchField />
      </Toolbar>
      <PageBody>
        <Table>
          <TableHead>
            <RowHead>
              {isAdvanced && <CellHead>Clé</CellHead>}
              {isAdvanced && <CellHead>Type</CellHead>}
              <CellHead>Nom</CellHead>
              <CellHead>Résolution</CellHead>
              <CellHead>Online</CellHead>
              <CellHead>Création</CellHead>
              <CellHead>Média</CellHead>
              <CellHead>Actions</CellHead>
            </RowHead>
          </TableHead>
          <TableBody>
            {devices.map((d) => (
              <Row key={d.id}>
                {isAdvanced && (
                  <Cell>
                    <Field
                      {...tooltip(d.id)}
                      value={d.key}
                      onValue={(key) => deviceCtrl.update(d.id, { key })}
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
                  <Field value={d.name} onValue={(name) => deviceCtrl.update(d.id, { name })} />
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
                    onValue={(media) => deviceCtrl.update(d.id, { media })}
                  />
                </Cell>
                <Cell variant="around">
                  <Button
                    icon={<RefreshCw />}
                    color="primary"
                    {...tooltip('Rafraîchir')}
                    onClick={() => deviceCtrl.update(d.id, { action: 'reload' })}
                  />
                  <Button
                    icon={<Power />}
                    color="primary"
                    {...tooltip('Redémarrer')}
                    onClick={() => deviceCtrl.update(d.id, { action: 'reboot' })}
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
                      onClick={() => deviceCtrl.delete(d.id)}
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
