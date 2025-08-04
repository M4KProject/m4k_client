import { Css, flexRow, isSearched, round } from '@common/helpers';
import { addTranslates, useAsync, useCss, useMsg } from '@common/hooks';
import { isAdvanced$, search$ } from '../messages';
import { MdFileUpload, MdSync, MdFolder, MdImage, MdVideoCameraBack, MdPictureAsPdf, MdSquare, MdDelete } from "react-icons/md";
import { FAILED, groupColl, groupId$, mediaColl, MediaModel, ModelUpdate, PENDING, PROCESSING, SUCCESS, upload, UPLOADING, uploadItems$ } from '@common/api';
import { tooltip, Div, Page, PageHeader, PageBody, Button, UploadButton, Table, Row, CellHeader, TableHead, TableBody, Cell, Field, Tr, Progress } from '@common/components';
import { SearchField } from '../components/SearchField';
import { useEffect } from 'preact/hooks';

addTranslates({
    [PENDING]: 'en attente',
    [UPLOADING]: 'téléchargement',
    [PROCESSING]: 'traitement',
    [FAILED]: 'échec',
    [SUCCESS]: 'succès',
});

const css: Css = {
    '&Page': {

    },

    '&Icon': {
        ...flexRow({ align: 'center', justify: 'start' }),
        w: '100%',
    },
    '&Icon span': {
        ml: 0.5,
    },

    '&Preview': {
        position: 'absolute',
        xy: '50%',
        wh: '100%',
        translate: '-50%, -50%',
        bgMode: 'contain',
        transition: 0.2,
        userSelect: 'none',
        pointerEvents: 'none',
    },
    '&PreviewCell:hover &Preview': {
        xy: '50%',
        wh: 15,
        zIndex: 1,
        translate: '-50%, -50%',
        // bg: 'primary',
        // border: 'primary',
        // borderWidth: '0.5em',
        rounded: 1,
    },

    [`&-${PENDING}`]: {},
    [`&-${UPLOADING}`]: { fg: 'primary' },
    [`&-${PROCESSING}`]: { fg: 'secondary' },
    [`&-${FAILED}`]: { fg: 'error' },
    [`&-${SUCCESS}`]: { fg: 'success' },
};

const iconByType: Record<string, [string, string, typeof MdFolder]> = {
    'application/folderectory': ['Dossier', '', MdFolder],
    'application/pdf': ['PDF', '', MdPictureAsPdf],
    'application/site': ['Site', '', MdImage],
    'image/svg+xml': ['Image', 'SVG', MdImage],
    'image/jpeg': ['Image', 'JPEG', MdImage],
    'image/png': ['Image', 'PNG', MdImage],
    'video/mp4': ['Video', 'MP4', MdVideoCameraBack],
    'video/webm': ['Video', 'WEBM', MdVideoCameraBack],
}

const getIcon = (_c: string, type: string) => {
    const c = useCss('Media', css);
    const [title, codec, Icon] = iconByType[type] || [type, '', MdSquare];
    return (
        <Div cls={`${c}Icon`} {...(codec ? tooltip(codec) : {})}>
            <Icon />
            {title && <span>{title}</span>}
        </Div>
    );
}

const sizeFormat = (size?: number) => {
    if (!size) return '';
    const kb = size / 1024;
    const mb = kb / 1024;
    const gb = mb / 1024;
    if (gb > 0.95) return round(gb, 2) + 'Go';
    if (mb > 0.95) return round(mb, 2) + 'Mo';
    if (kb > 0.95) return round(kb, 2) + 'Ko';
    return size + 'o';
}

const durationFormat = (duration?: number) => {
    if (!duration) return '';
    const s = duration / 1000;
    return Math.round(s) + 's';
}

// const setDataTransferJson = ({ dataTransfer }: React.DragEvent, data: any) => {
//     dataTransfer.clearData();
//     dataTransfer.setData("application/json", JSON.stringify(data));
// }

// const getDataTransferJson = ({ dataTransfer }: React.DragEvent): string => {
//     return JSON.parse(dataTransfer.getData("application/json"));
// }

// const setDataTransferText = ({ dataTransfer }: React.DragEvent, text: string) => {
//     dataTransfer.clearData();
//     dataTransfer.setData("text/plain", text);
// }

// const getDataTransferText = ({ dataTransfer }: React.DragEvent): string => {
//     return dataTransfer.getData("text/plain");
// }

// const Job = ({ c, jobId }: { c:string, jobId: string }) => {
//     console.debug('Job', jobId);

//     const jobs = useMsg(jobs$);
//     const job = jobs[jobId] || {};

//     const status = job.status;

//     useEffect(() => {
//         waitJob(jobId);
//     }, [jobId]);

//     useEffect(() => {
//         if (status === 'finished') {
//             mediasRefresh();
//         }
//     }, [status]);

//     if (job.error) {
//         return <Button cls={`${c}Job ${c}Job-error`} icon={<MdError />}  {...tooltip(job.error)} />
//     }
    
//     switch (status) {
//         case 'pending':
//             return <Loading cls={`${c}Job ${c}Job-pending`} />
//         case 'processing':
//             return <Progress cls={`${c}Job ${c}Job-processing`} progress={job.progress} />
//         case 'finished':
//             return <Progress cls={`${c}Job ${c}Job-finished`} progress={100} />
//         default:
//             return <Button cls={`${c}Job ${c}Job-error`} icon={<MdError />} {...tooltip(`status: ${status}`)} />
//     }
// };

export const MediasProgress = () => {
    const c = useCss('Media', css);
    const items = Object.values(useMsg(uploadItems$));

    if (items.length === 0) {
        return null;
    }
    
    return (
        <Table>
            <TableHead>
                <Row>
                    <CellHeader>Nom</CellHeader>
                    <CellHeader>Etat</CellHeader>
                    <CellHeader>Progression</CellHeader>
                </Row>
            </TableHead>
            <TableBody>
                {items.map(m => (
                    <Row key={m.id}>
                        <Cell>{m.name}</Cell>
                        <Cell cls={`${c}-${m.status}`}><Tr>{m.status}</Tr></Cell>
                        <Cell><Progress progress={m.progress} /></Cell>
                    </Row>
                ))}
            </TableBody>
        </Table>
    )
}

export const MediasPage = () => {
    const c = useCss('Media', css);
    const search = useMsg(search$);
    const groupId = useMsg(groupId$);
    const isAdvanced = useMsg(isAdvanced$);

    const [groups, groupsRefresh] = useAsync([], () => groupColl.find({}));
    
    const [medias, mediasRefresh] = useAsync([], () => mediaColl.find(groupId ? { group: groupId } : {}), 'medias', [groupId]);
    const filteredMedias = search ? medias.filter(m => isSearched((m.name||'') + (m.desc||'') + (m.type||''), search)) : medias;

    useEffect(() => uploadItems$.debounce(100).on(mediasRefresh), [mediasRefresh]);

    const handleRefresh = () => {
        mediasRefresh();
        -groupsRefresh();
    }

    const handleUpdate = async (media: MediaModel, changes: ModelUpdate<MediaModel>) => {
        await mediaColl.update(media.id, changes);
        mediasRefresh();
    }

    const handleDelete = async (media: MediaModel) => {
        await mediaColl.delete(media.id);
        await mediasRefresh();
    }

    return (
        <Page cls={`${c}Page`}>
            <PageHeader title="Les medias">
                <UploadButton
                    title="Téléverser"
                    {...tooltip('Téléverser des medias')}
                    icon={<MdFileUpload />}
                    color="primary"
                    onFiles={upload}
                />
                <Button
                    title="Rafraîchir"
                    {...tooltip('Rafraîchir')}
                    icon={<MdSync />}
                    color="primary"
                    onClick={handleRefresh}
                />
                <SearchField />
            </PageHeader>
            <PageBody>
                <MediasProgress />
                <Table>
                    <TableHead>
                        <Row>
                            {isAdvanced && <CellHeader>Groupe</CellHeader>}
                            <CellHeader>Type</CellHeader>
                            <CellHeader>Nom</CellHeader>
                            <CellHeader>Description</CellHeader>
                            <CellHeader>Aperçu</CellHeader>
                            <CellHeader>Poids</CellHeader>
                            <CellHeader>Résolution</CellHeader>
                            <CellHeader>Durée</CellHeader>
                            <CellHeader>Actions</CellHeader>
                        </Row>
                    </TableHead>
                    <TableBody>
                        {filteredMedias.map(m => (
                            <Row key={m.id}>
                                {isAdvanced && (
                                    <Cell>
                                        <Field
                                            type="select"
                                            items={groups.map(g => [g.id, g.name])}
                                            value={m.group}
                                            onValue={(group) => handleUpdate(m, { group })}
                                        />
                                    </Cell>
                                )}
                                <Cell variant="row">{getIcon(c, m.type||'')}</Cell>
                                <Cell>
                                    <Field {...(isAdvanced ? tooltip(m.id) : {})} value={m.name} onValue={name => handleUpdate(m, { name })} />
                                </Cell>
                                <Cell>
                                    <Field value={m.desc} onValue={desc => handleUpdate(m, { desc })} />
                                </Cell>
                                <Cell cls={`${c}PreviewCell`}>
                                    <Div cls={`${c}Preview`} style={{
                                        backgroundImage: `url("${mediaColl.getThumbUrl(m.id, m.file, [300, 300])}")`
                                    }} />
                                </Cell>
                                <Cell>{sizeFormat(m.size)}</Cell>
                                <Cell>{m.width}x{m.height}</Cell>
                                <Cell>{durationFormat(m.duration)}</Cell>
                                <Cell variant="around">
                                    {/* {item.mimetype === 'application/zip' && (
                                        <Button
                                            icon={<TbFileTypeZip />}
                                            color="primary"
                                            {...tooltip("Décompression")}
                                            onClick={async () => {
                                                const mediaId = (item as MediaInfo).id;
                                                const groupId = groupId$.v;
                                                if (!mediaId) return;
                                                if (!groupId) return;
                                                const job = await addJob(groupId, 'unzip', { name: item.name });
                                                if (!job) return;
                                                await updateMediaData(item.id, { jobId: job.id });
                                                // await mediasRefresh();
                                            }}
                                        />
                                    )} */}
                                    {/* <Button
                                        icon={<MdRefresh />}
                                        color="primary"
                                        {...tooltip("Optimiser le média")}
                                        onClick={async () => {
                                            const mediaId = (item as MediaInfo).id;
                                            const groupId = groupId$.v;
                                            if (!mediaId) return;
                                            if (!groupId) return;
                                            const job = await addJob(groupId, 'convert', { name: item.name });
                                            if (!job) return;
                                            await updateMediaData(item.id, { jobId: job.id });
                                            // await mediasRefresh();
                                        }}
                                    /> */}
                                    <Button
                                        icon={<MdDelete />}
                                        color="error"
                                        {...tooltip("Supprimer")}
                                        onClick={() => handleDelete(m)}
                                    />
                                </Cell>
                            </Row>
                        ))}
                    </TableBody>
                </Table>
            </PageBody>
        </Page>
    );
}