import {
  by,
  byId,
  Css,
  flexRow,
  groupBy,
  isPositive,
  isSearched,
  round,
  sort,
} from '@common/helpers';
import { addTranslates, useAsync, useCss, useMsg } from '@common/hooks';
import { isAdvanced$, search$ } from '../messages';
import {
  Upload,
  RefreshCw,
  FolderOpen,
  FileImage,
  Video,
  FileText,
  Square,
  Trash2,
} from 'lucide-react';
import {
  FAILED,
  groupColl,
  groupId$,
  mediaColl,
  MediaModel,
  ModelUpdate,
  PENDING,
  PROCESSING,
  SUCCESS,
  upload,
  UPLOADING,
  uploadItems$,
} from '@common/api';
import {
  tooltip,
  Div,
  Page,
  PageHeader,
  PageBody,
  Button,
  UploadButton,
  Table,
  Row,
  CellHeader,
  TableHead,
  TableBody,
  Cell,
  Field,
  Tr,
  Progress,
} from '@common/components';
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
  '&Page': {},

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

const infoByType: Record<string, [string, typeof FolderOpen]> = {
  folder: ['Dossier', FolderOpen],
  pdf: ['PDF', FileText],
  site: ['Site', FileImage],
  svg: ['Image SVG', FileImage],
  jpeg: ['Image JPG', FileImage],
  png: ['Image PNG', FileImage],
  mp4: ['Video MP4', Video],
  webm: ['Video WEBM', Video],
};

const getTypeIcon = (c: string, type: string) => {
  const parts = type.split(/\W/);
  const info = infoByType[type] || infoByType[parts[1]] || [type, Square];
  const [title, Icon] = info;
  return <Icon class={`${c}Icon`} {...tooltip(title)} />;
};

const sizeFormat = (size?: number) => {
  if (!size) return '';
  const kb = size / 1024;
  const mb = kb / 1024;
  const gb = mb / 1024;
  if (gb > 0.95) return round(gb, 2) + 'Go';
  if (mb > 0.95) return round(mb, 2) + 'Mo';
  if (kb > 0.95) return round(kb, 2) + 'Ko';
  return size + 'o';
};

const secondsFormat = (s?: number) => (isPositive(s) ? round(s) + 's' : '');

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
        {items.map((m) => (
          <Row key={m.id}>
            <Cell>{m.name}</Cell>
            <Cell cls={`${c}-${m.status}`}>
              <Tr>{m.status}</Tr>
            </Cell>
            <Cell>
              <Progress progress={m.progress} />
            </Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );
};

export const MediasTable = () => {
  const c = useCss('Media', css);
  const search = useMsg(search$);
  const groupId = useMsg(groupId$);
  const isAdvanced = useMsg(isAdvanced$);

  const [medias, mediasRefresh] = useAsync(
    [],
    () => mediaColl.find(groupId ? { group: groupId } : {}),
    'medias',
    [groupId]
  );

  const mediaById = byId(medias);

  // Get Media PATH
  for (const media of medias) {
    const paths: string[] = [];
    let curr = media;
    while (curr) {
      paths.push(curr.title);
      curr = curr.parent ? mediaById[curr.parent] : null;
    }
    paths.reverse();
    media.paths = paths;
    media.order = paths.join('/');
  }

  const sortedMedias = sort(medias, (m) => m.order);

  const filteredMedias = search
    ? sortedMedias.filter((m) =>
        isSearched((m.title || '') + (m.desc || '') + (m.type || ''), search)
      )
    : sortedMedias;

  useEffect(() => uploadItems$.debounce(100).on(mediasRefresh), [mediasRefresh]);

  // const handleRefresh = () => {
  //   mediasRefresh();
  // };

  const handleUpdate = async (media: MediaModel, changes: ModelUpdate<MediaModel>) => {
    await mediaColl.update(media.id, changes);
    mediasRefresh();
  };

  const handleDelete = async (media: MediaModel) => {
    await mediaColl.delete(media.id);
    await mediasRefresh();
  };

  return (
    <>
      <MediasProgress />
      <Table>
        <TableHead>
          <Row>
            <CellHeader>Titre</CellHeader>
            <CellHeader>Description</CellHeader>
            <CellHeader>Aperçu</CellHeader>
            <CellHeader>Poids</CellHeader>
            <CellHeader>Résolution</CellHeader>
            <CellHeader>Durée</CellHeader>
            <CellHeader>Actions</CellHeader>
          </Row>
        </TableHead>
        <TableBody>
          {filteredMedias.map((m) => (
            <Row key={m.id}>
              <Cell variant="row">
                <Div cls={``} style={{ width: 2 * (m.paths.length - 1) + 'em' }} />
                {getTypeIcon(c, m.type || '')}
                <Field
                  {...(isAdvanced ? tooltip(m.order) : {})}
                  value={m.title}
                  onValue={(title) => handleUpdate(m, { title })}
                />
              </Cell>
              <Cell>
                <Field value={m.desc} onValue={(desc) => handleUpdate(m, { desc })} />
              </Cell>
              <Cell cls={`${c}PreviewCell`}>
                <Div
                  cls={`${c}Preview`}
                  style={{
                    backgroundImage: `url("${mediaColl.getThumbUrl(m.id, m.file, [300, 300])}")`,
                  }}
                />
              </Cell>
              <Cell>{sizeFormat(m.bytes)}</Cell>
              <Cell>
                {m.width || 0}x{m.height || 0}
              </Cell>
              <Cell>{secondsFormat(m.seconds)}</Cell>
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
                  icon={<Trash2 />}
                  color="error"
                  {...tooltip('Supprimer')}
                  onClick={() => handleDelete(m)}
                />
              </Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
