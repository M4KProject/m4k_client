import { Css, flexColumn, flexRow } from '@common/ui';
import { byId, isEmpty, isPositive, round, sort } from '@common/utils';
import { addTranslates, useMsg } from '@common/hooks';
import { isAdvanced$, selectedById$ } from '../messages';
import {
  FolderOpen,
  FileImage,
  Video,
  FileText,
  Square,
  Trash2,
  FolderPlus,
  FolderInput,
  MapPlus
} from 'lucide-react';
import { FAILED, PENDING, PROCESSING, SUCCESS, UPLOADING, uploadItems$, groupId$, needAuthId, needGroupId, MediaModel, collSync } from '@common/api';
import {
  tooltip,
  Button,
  Table,
  Row,
  CellHeader,
  TableHead,
  TableBody,
  Cell,
  Field,
  Tr,
  Progress,
  PageHeader,
  Toolbar,
} from '@common/components';
import { JobsTable } from './JobsTable';
import { SearchField } from './SearchField';
import { SelectedField } from './SelectedField';
import { MediaPreview } from './MediaPreview';
import { useGroupQuery } from '@common/hooks/useQuery';
import { jobCtrl, mediaCtrl } from '../controllers';

addTranslates({
  [PENDING]: 'en attente',
  [UPLOADING]: 'téléchargement',
  [PROCESSING]: 'traitement',
  [FAILED]: 'échec',
  [SUCCESS]: 'succès',
});

const c = Css('Media', {
  '&Page': {},

  '&Icon': {
    ...flexRow({ align: 'center', justify: 'start' }),
    w: '100%',
  },
  '&Icon span': {
    ml: 0.5,
  },

  [`&-${PENDING}`]: {},
  [`&-${UPLOADING}`]: { fg: 'primary' },
  [`&-${PROCESSING}`]: { fg: 'secondary' },
  [`&-${FAILED}`]: { fg: 'error' },
  [`&-${SUCCESS}`]: { fg: 'success' },

  ['&Jobs']: {
    ...flexColumn({ align: 'stretch' }),
    position: 'absolute',
    r: 0,
    b: 0,
    w: 40,
    bg: '#f5f5f5',
  },
});

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

const getTypeIcon = (type: string) => {
  const parts = type.split(/\W/);
  const info = infoByType[type] || infoByType[parts[1]] || [type, Square];
  const [title, Icon] = info;
  return <Icon class={c(`Icon`)} {...tooltip(title)} />;
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

export const MediasProgress = () => {
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
            <Cell class={c('-${m.status}')}>
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

export const getNextTitle = (medias: MediaModel[], start: string) => {
  let i = 1;
  let title = start;
  while (true) {
    if (!medias.find(m => m.title===title)) break;
    title = start + (++i);
  }
  return title;
}

export const MediasTable = () => {
  const isAdvanced = useMsg(isAdvanced$);
  const medias = useGroupQuery(mediaCtrl);
  const jobs = useGroupQuery(jobCtrl);

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

  const selectedById = useMsg(selectedById$);
  const selectedIds = Object.keys(selectedById).filter((id) => mediaById[id]);

  return (
    <>
      <MediasProgress />
      <Toolbar>
        <Button
          icon={<FolderPlus />}
          {...tooltip('Créer un nouveau dossier')}
          onClick={() => {
            mediaCtrl.create({
              title: getNextTitle(medias, 'Dossier'),
              mime: 'application/folder',
              type: 'folder',
              user: needAuthId(),
              group: needGroupId(),
            });
          }}
        >
          Nouveau dossier
        </Button>
        <Button
          icon={<MapPlus />}
          {...tooltip('Créer une playlist')}
          onClick={() => {
            mediaCtrl.create({
              title: getNextTitle(medias, 'Playlist'),
              mime: 'application/playlist',
              type: 'playlist',
              user: needAuthId(),
              group: needGroupId(),
            });
          }}
        >
          Ajouter Playlist
        </Button>
        <SearchField />
      </Toolbar>
      <Table>
        <TableHead>
          <Row>
            <CellHeader />
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
          {sortedMedias.map((m) => (
            <Row key={m.id}>
              <Cell variant="check">
                <SelectedField id={m.id} />
              </Cell>
              <Cell variant="row">
                <div style={{ width: 2 * (m.paths.length - 1) + 'em' }} />
                {getTypeIcon(m.type || '')}
                <Field
                  {...(isAdvanced ? tooltip(m.order) : {})}
                  value={m.title}
                  onValue={(title) => mediaCtrl.update(m.id, { title })}
                />
              </Cell>
              <Cell>
                <Field value={m.desc} onValue={(desc) => mediaCtrl.update(m.id, { desc })} />
              </Cell>
              <Cell>
                <MediaPreview media={m} />
              </Cell>
              <Cell>{sizeFormat(m.bytes)}</Cell>
              <Cell>{m.width || m.height ? (m.width || 0) + 'x' + (m.height || 0) : ''}</Cell>
              <Cell>{secondsFormat(m.seconds)}</Cell>
              <Cell variant="around">
                {m.type === 'folder' && selectedIds.length > 0 && (
                  <Button
                    icon={<FolderInput />}
                    {...tooltip(`Ajouter ${selectedIds.length} élément(s) au dossier`)}
                    onClick={async () => {
                      for (const id of selectedIds) {
                        selectedById$.setItem(id, undefined);
                        await mediaCtrl.update(id, { parent: m.id });
                      }
                    }}
                  />
                )}
                <Button
                  icon={<Trash2 />}
                  color="error"
                  {...tooltip('Supprimer')}
                  onClick={() => mediaCtrl.delete(m.id)}
                />
              </Cell>
            </Row>
          ))}
          {!isEmpty(jobs.filter((job) => job.status !== 'finished' && !!job.media)) && (
            <div class={c('Jobs')}>
              <PageHeader title="Les jobs" />
              <JobsTable filter={(job) => job.status !== 'finished' && !!job.media} />
            </div>
          )}
        </TableBody>
      </Table>
    </>
  );
};
