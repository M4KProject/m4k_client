import { Css, formatDateTime, isSearched, stringify } from '@common/helpers';
import { useAsync, useCss, useMsg } from '@common/hooks';
import { search$ } from '../messages/search$';
import { contentColl, deviceColl, DeviceModel, getApiTime, groupColl, groupId$, ModelUpdate, toTime } from '@common/api';
import { openDevice } from '../controllers/Router';
import { Button, Field, Page, PageHeader, PageBody, Table, Cell, CellHeader, Row, TableBody, TableHead, tooltip } from '@common/components';
import { MdSync, MdDeleteForever, MdSettingsRemote } from "react-icons/md";
import { SearchField } from '../components/SearchField';
import { isAdvanced$ } from '@/messages';

const css: Css = {
};

export const DevicesPage = () => {
    const c = useCss('DevicesPage', css);
    const search = useMsg(search$);
    const groupId = useMsg(groupId$);
    const isAdvanced = useMsg(isAdvanced$);

    const [groups, groupsRefresh] = useAsync([], () => groupColl.find({}));
    
    const [contents, contentsRefresh] = useAsync([], () => contentColl.find({ group: groupId }), 'contents', [groupId])
    
    const [devices, devicesRefresh] = useAsync([], () => deviceColl.find(groupId ? { group: groupId } : {}), 'devices', [groupId]);
    const filteredDevices = search ? devices.filter(d => isSearched(d.name, search)) : devices;

    const onlineMin = getApiTime() - 30 * 1000;
    
    // const handleAdd = async () => {
    //     const groupId = groupId$.v;
    //     if (!groupId) return;
    //     const deviceId = prompt("ID de l'écrans à ajouter :");
    //     if (!deviceId) return;
    //     await deviceRepo.update(deviceId, { group_id: groupId });
    // };

    const handleUpdate = async (device: DeviceModel, changes: ModelUpdate<DeviceModel>) => {
        await deviceColl.update(device.id, changes);
        await groupsRefresh();
        await devicesRefresh();
        await contentsRefresh();
    }

    const handleDelete = (device: DeviceModel) => deviceColl.delete(device.id);

    const handleRemote = (device: DeviceModel) => {
        openDevice(device.key || device.id);
    };

    return (
        <Page cls={c}>
            <PageHeader title="Les écrans">
                {/* <Button color="primary" onClick={handleAdd}>
                    <MdAddToPhotos />
                    Ajouter
                </Button> */}
                <Button icon={<MdSync />} color="primary" onClick={devicesRefresh}>
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
                            {/* {isAdvanced && <CellHeader>Création</CellHeader>} */}
                            {isAdvanced && <CellHeader>Démarrage</CellHeader>}
                            <CellHeader>Contenu</CellHeader>
                            <CellHeader>Actions</CellHeader>
                        </Row>
                    </TableHead>
                    <TableBody>
                        {filteredDevices.map(d => (
                            <Row key={d.id}>
                                {isAdvanced && (
                                    <Cell>
                                        <Field
                                            type="select"
                                            items={groups.map(g => [g.id, g.name])}
                                            value={d.group}
                                            onValue={group => handleUpdate(d, { group })}
                                        />
                                    </Cell>
                                )}
                                {isAdvanced && (
                                    <Cell>
                                        <Field {...tooltip(d.id)} value={d.key} onValue={key => handleUpdate(d, { key })} />
                                    </Cell>
                                )}
                                {isAdvanced && (
                                    <Cell>
                                        <Field {...tooltip(() => stringify(d.info, null, 2))} value={`${d.type} ${d.version}`} readonly />
                                    </Cell>
                                )}
                                <Cell>
                                    <Field value={d.name} onValue={name => handleUpdate(d, { name })} />
                                </Cell>
                                <Cell>{`${d.width}x${d.height}`}</Cell>
                                <Cell>
                                    <Field {...tooltip(formatDateTime(d.online))} type="switch" value={d.online && toTime(d.online) > onlineMin} readonly />
                                </Cell>
                                {/* {isAdvanced && <Cell>{formatDateTime(d.created)}</Cell>} */}
                                {isAdvanced && <Cell>{formatDateTime(d.started)}</Cell>}
                                <Cell>
                                    <Field
                                        type="select"
                                        items={contents.map(c => [c.id, c.title||c.key||c.id])}
                                        value={d.content}
                                        onValue={content => handleUpdate(d, { content })}
                                    />
                                </Cell>
                                <Cell variant="around">
                                    <Button
                                        icon={<MdSettingsRemote />}
                                        color="primary"
                                        {...tooltip("Mode remote")}
                                        onClick={() => handleRemote(d)}
                                    />
                                    {isAdvanced && (
                                        <Button
                                            icon={<MdDeleteForever />}
                                            color="error"
                                            {...tooltip("Supprimer")}
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
}