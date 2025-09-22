import { Css } from '@common/ui';
import { byId, Dict, groupBy, isEmpty, isPositive, round } from '@common/utils';
import { addTr, useMsg } from '@common/hooks';
import { isAdvanced$, selectedById$ } from '../messages';
import {
  FolderOpen,
  Folder,
  FileImage,
  Video,
  FileText,
  Trash2,
  FolderPlus,
  FolderInput,
  MapPlus,
  PlusSquare,
  Settings,
  List,
  ListX,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Upload,
} from 'lucide-react';
import { uploadItems$, needAuthId, needGroupId, MediaModel, MediaType, upload } from '@common/api';
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
  Toolbar,
  UploadButton,
} from '@common/components';
import { JobsTable } from './JobsTable';
import { SearchField } from './SearchField';
import { SelectedField } from './SelectedField';
import { MediaPreview } from './MediaPreview';
import { useGroupQuery } from '@common/hooks/useQuery';
import { jobCtrl, mediaCtrl, updatePlaylist } from '../controllers';
import { useState } from 'preact/hooks';

addTr({
  pending: 'en attente',
  uploading: 'téléchargement',
  processing: 'traitement',
  failed: 'échec',
  success: 'succès',
});

const c = Css('Media', {
  Page: {},

  Icon: {
    fRow: ['center', 'start'],
    w: '100%',
  },
  'Icon span': {
    ml: 0.5,
  },

  '-pending': {},
  '-uploading': { fg: 'primary' },
  '-processing': { fg: 'secondary' },
  '-failed': { fg: 'error' },
  '-success': { fg: 'success' },

  Jobs: {
    fRow: ['stretch'],
    position: 'absolute',
    r: 0,
    b: 0,
    w: 40,
    bg: '#f5f5f5',
  },
});

const infoByType: Record<MediaType, [string, typeof FolderOpen]> = {
  playlist: ['Playlist', List],
  folder: ['Dossier', Folder],
  image: ['Image', FileImage],
  pdf: ['PDF', FileText],
  video: ['Video', Video],
  unknown: ['Inconnu', HelpCircle],
  '': ['Inconnu', HelpCircle],
};

const getTypeIcon = (media: MediaModel, isOpen: boolean, hasChildren: boolean) => {
  const type = media.type || 'unknown';
  let Icon = infoByType[type]?.[1] || HelpCircle;
  let title = infoByType[type]?.[0] || 'Inconnu';

  // Pour les dossiers et playlists, on gère l'état ouvert/fermé et vide/plein
  if (type === 'folder') {
    const isEmpty = !hasChildren;
    if (isEmpty) {
      Icon = Folder;
      title = 'Dossier vide';
    } else {
      Icon = isOpen ? FolderOpen : Folder;
      title = isOpen ? 'Dossier ouvert' : 'Dossier fermé';
    }
  } else if (type === 'playlist') {
    const isEmpty = !hasChildren;
    if (isEmpty) {
      Icon = ListX;
      title = 'Playlist vide';
    } else {
      Icon = isOpen ? List : List;
      title = isOpen ? 'Playlist ouverte' : 'Playlist fermée';
    }
  }

  return (
    <div class={c('Icon')}>
      <Icon {...tooltip(title)} />
      {(type === 'folder' || type === 'playlist') && hasChildren && (
        <span>{isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}</span>
      )}
    </div>
  );
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
    if (!medias.find((m) => m.title === title)) break;
    title = start + ++i;
  }
  return title;
};

interface MediaCtx {
  mediaById: Dict<MediaModel>;
  mediasByParent: Dict<MediaModel[]>;
  isAdvanced: boolean;
  selectedIds: string[];
}

// const getMediaCtx = (medias: MediaModel[]) => {

//   // // Get Media PATH
//   // for (const media of medias) {
//   //   const paths: string[] = [];
//   //   let curr = media;
//   //   while (curr) {
//   //     paths.push(curr.title);
//   //     curr = curr.parent ? mediaById[curr.parent] : null;
//   //   }
//   //   paths.reverse();
//   //   media.paths = paths;
//   //   media.order = paths.join('/');
//   // }
//   // const sortedMedias = sort(medias, (m) => m.order);

//   return {
//     mediaById,
//     mediasByParent,
//   }
// }

const MediasRow = ({ m, ctx, tab }: { m: MediaModel; ctx: MediaCtx; tab: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { isAdvanced, selectedIds, mediaById, mediasByParent } = ctx;

  const children = mediasByParent[m.id] || [];
  const deps = m.deps?.map((id) => mediaById[id]).filter(Boolean) || [];

  console.debug('MediasRow', {
    m,
    tab,
    children,
    deps,
  });

  return (
    <>
      <Row key={m.id}>
        <Cell variant="check">
          <SelectedField id={m.id} />
        </Cell>
        <Cell variant="row">
          <div style={{ width: 2 * tab + 'em' }} />
          <div onClick={() => setIsOpen((o) => !o)}>
            {getTypeIcon(m, isOpen, deps.length + children.length > 0)}
          </div>
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
        <Cell variant="actions">
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
          {m.type === 'playlist' && (
            <>
              <Button
                icon={<Settings />}
                {...tooltip(`Configurer la playlist`)}
                onClick={async () => {}}
              />
              {selectedIds.length > 0 && (
                <Button
                  icon={<PlusSquare />}
                  {...tooltip(`Ajouter ${selectedIds.length} élément(s) à la playlist`)}
                  onClick={async () => {
                    updatePlaylist(m.id, (playlist) => {
                      playlist.data.items = [
                        ...playlist.data.items,
                        ...selectedIds.map((id) => ({
                          media: id,
                        })),
                      ];
                    });
                  }}
                />
              )}
            </>
          )}
          (
          <Button
            icon={<Trash2 />}
            color="error"
            {...tooltip('Supprimer')}
            onClick={async () => {
              for (const c of children) {
                mediaCtrl.update(c.id, { parent: null });
              }
              mediaCtrl.delete(m.id);
            }}
          />
          )
        </Cell>
      </Row>
      {isOpen &&
        children.map((child) => <MediasRow key={child.id} m={child} ctx={ctx} tab={tab + 1} />)}
      {isOpen &&
        deps.map((child) => <MediasRow key={child.id} m={child} ctx={ctx} tab={tab + 1} />)}
    </>
  );
};

export const MediasTable = () => {
  const medias = useGroupQuery(mediaCtrl);
  const jobs = useGroupQuery(jobCtrl);
  const isAdvanced = useMsg(isAdvanced$);
  const allSelectedById = useMsg(selectedById$);
  const mediaById = byId(medias);
  const mediasByParent = groupBy(medias, (m) => mediaById[m.parent]?.id || '');
  const selectedIds = Object.keys(allSelectedById).filter((id) => mediaById[id]);

  const ctx: MediaCtx = {
    mediaById,
    mediasByParent,
    isAdvanced,
    selectedIds,
  };

  console.debug('MediasTable', ctx);

  return (
    <>
      <MediasProgress />
      <Toolbar title="Medias">
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
        <UploadButton
          title="Téléverser"
          {...tooltip('Téléverser des medias')}
          icon={<Upload />}
          color="primary"
          onFiles={upload}
        />
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
            <CellHeader />
          </Row>
        </TableHead>
        <TableBody>
          {mediasByParent['']?.map((m) => (
            <MediasRow key={m.id} m={m} tab={0} ctx={ctx} />
          ))}
          {!isEmpty(jobs.filter((job) => job.status !== 'finished' && !!job.media)) && (
            <div class={c('Jobs')}>
              <Toolbar title="Les jobs" />
              <JobsTable filter={(job) => job.status !== 'finished' && !!job.media} />
            </div>
          )}
        </TableBody>
      </Table>
    </>
  );
};
