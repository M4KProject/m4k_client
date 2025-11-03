import { Css } from 'fluxio';
import { byId, groupBy, sortItems, fluxDictionary, isUFloat } from 'fluxio';
import { addTr, useFlux } from '@common/hooks';
import { MediaModel } from '@/api';
import { Grid, GridCols } from '@common/components';
import { JobGrid } from '../jobs/JobGrid';
import { selectedById$ } from '@/admin/controllers/selected';
import { useGroupMedias } from '@/api/hooks';
import { useIsAdvanced } from '@/router/hooks';
import { Dictionary, round } from 'fluxio';
import { Trash2, FolderInput, PlusSquare, Edit, Eye, Download } from 'lucide-react';
import { tooltip, Button, Field } from '@common/components';
import { SelectedField } from '../SelectedField';
import { MediaPreview } from './MediaPreview';
import { updatePlaylist } from '../../controllers';
import { mediaSync } from '@/api/sync';
import { MediaIcon } from './MediaIcon';
import { updateRoute } from '@/router/setters';
import { useMemo } from 'preact/hooks';
import { startMediaDownload } from '@/api/startMediaDownload';

addTr({
  pending: 'en attente',
  uploading: 'téléchargement',
  processing: 'traitement',
  failed: 'échec',
  success: 'succès',
});

const c = Css('MediaTable', {
  Select: {},
  Actions: {},
});

interface MediaGridCtx {
  isAdvanced: boolean;
  selectedIds: string[];
  getTab: (id: string) => number;
  getIsOpen: (id: string) => boolean;
  setIsOpen: (id: string, isOpen: boolean) => void;
  getChildren: (id: string) => MediaModel[];
}

const cols: GridCols<MediaModel, MediaGridCtx> = {
  select: ['', ({ id }) => <SelectedField id={id} />, { w: 10, cls: c('Select') }],
  title: [
    'Titre',
    ({ id, type, title }, { isAdvanced, getTab, getIsOpen, setIsOpen, getChildren }) => (
      <>
        <div style={{ width: 2 * getTab(id) + 'em' }} />
        <div onClick={() => setIsOpen(id, !getIsOpen(id))}>
          <MediaIcon
            type={type}
            isOpen={getIsOpen(id)}
            hasChildren={type === 'folder' && getChildren(id).length > 0}
          />
        </div>
        <Field value={title} onValue={(title) => mediaSync.update(id, { title })} />
      </>
    ),
    { w: 100 },
  ],
  preview: ['Aperçu', (media) => <MediaPreview media={media} />, { w: 20 }],
  size: [
    'Poids',
    ({ bytes }) => {
      if (!bytes) return '';
      const kb = bytes / 1024;
      const mb = kb / 1024;
      const gb = mb / 1024;
      if (gb > 0.95) return round(gb, 2) + 'Go';
      if (mb > 0.95) return round(mb, 2) + 'Mo';
      if (kb > 0.95) return round(kb, 2) + 'Ko';
      return bytes + 'o';
    },
    { w: 20 },
  ],
  resolution: [
    'Résolution',
    ({ width, height }) => (width || height ? `${width || 0}x${height || 0}` : ''),
    { w: 20 },
  ],
  seconds: ['Durée', ({ seconds }) => (isUFloat(seconds) ? round(seconds) + 's' : ''), { w: 10 }],
  actions: [
    '',
    ({ id, key, type }, { selectedIds, getChildren }) => (
      <>
        {type === 'folder' && selectedIds.length > 0 && (
          <Button
            icon={<FolderInput />}
            {...tooltip(`Ajouter ${selectedIds.length} élément(s) au dossier`)}
            onClick={async () => {
              for (const selectId of selectedIds) {
                selectedById$.setItem(selectId, undefined);
                await mediaSync.update(selectId, { parent: id });
              }
            }}
          />
        )}
        {type === 'playlist' && (
          <>
            <Button
              icon={<Edit />}
              {...tooltip(`Configurer la playlist`)}
              onClick={() => {
                updateRoute({
                  page: 'medias',
                  mediaType: 'playlist',
                  mediaKey: key,
                  isEdit: true,
                });
              }}
            />
            {selectedIds.length > 0 && (
              <Button
                icon={<PlusSquare />}
                {...tooltip(`Ajouter ${selectedIds.length} élément(s) à la playlist`)}
                onClick={async () => {
                  updatePlaylist(id, (playlist) => {
                    if (playlist.data && playlist.data.items) {
                      playlist.data.items = [
                        ...playlist.data.items,
                        ...selectedIds.map((id) => ({
                          media: id,
                        })),
                      ];
                    }
                  });
                }}
              />
            )}
          </>
        )}
        {type === 'page' && (
          <Button
            icon={<Edit />}
            {...tooltip(`Éditer la page`)}
            onClick={() => {
              updateRoute({
                page: 'medias',
                mediaType: 'page',
                mediaKey: key,
                isEdit: true,
              });
            }}
          />
        )}
        <Button
          icon={<Eye />}
          {...tooltip('Afficher le media')}
          onClick={() => {
            updateRoute({ mediaKey: key, isEdit: false });
          }}
        />
        {type !== 'folder' && type !== 'playlist' && (
          <Button
            icon={<Download />}
            {...tooltip('Télécharger')}
            onClick={() => startMediaDownload(id)}
          />
        )}
        <Button
          icon={<Trash2 />}
          color="error"
          {...tooltip('Supprimer')}
          onClick={async () => {
            for (const c of getChildren(id)) {
              mediaSync.update(c.id, { parent: null as any });
            }
            mediaSync.delete(id);
          }}
        />
      </>
    ),
    { w: 20, cls: c('Actions') },
  ],
};

const openById$ = fluxDictionary<boolean>();

export const getMediasByParent = (medias: MediaModel[]) => {
  const mediaById = byId(medias);
  const mediasByParent = groupBy(medias, (m) => m.parent || '');
  const rootMedias = mediasByParent[''] || (mediasByParent[''] = []);
  for (const parentId in mediasByParent) {
    if (parentId) {
      const parent = mediaById[parentId];
      if (!parent && mediasByParent[parentId]) {
        rootMedias.push(...mediasByParent[parentId]!);
      }
    }
  }
  return mediasByParent;
};

export const MediaGrid = ({ type }: { type?: MediaModel['type'] }) => {
  const medias = useGroupMedias(type);
  const openById = useFlux(openById$);
  const isAdvanced = useIsAdvanced();
  const allSelectedById = useFlux(selectedById$);
  const mediaById = byId(medias);
  const mediasByParent = useMemo(() => getMediasByParent(medias), [medias]);
  const selectedIds = Object.keys(allSelectedById).filter((id) => id && mediaById[id]);

  const tabById: Dictionary<number> = {};
  const rootMedias = mediasByParent[''] || [];

  const items: MediaModel[] = [];

  const deep = (medias: MediaModel[], tab: number) => {
    sortItems(medias, (m) => m.title ?? '');
    for (const media of medias) {
      const id = media.id;
      items.push(media);
      tabById[id] = tab;
      if (id && openById[id]) {
        const children = mediasByParent[id];
        if (children) deep(children, tab + 1);
      }
    }
  };
  deep(rootMedias, 0);

  const ctx: MediaGridCtx = {
    isAdvanced: !!isAdvanced,
    selectedIds,
    getChildren: (id) => (id && mediasByParent[id]) || [],
    getIsOpen: (id) => !!(id && openById[id]),
    setIsOpen: (id, isOpen) => openById$.setItem(id, isOpen),
    getTab: (id) => (id && tabById[id]) || 0,
  };

  console.debug('MediaTable', ctx, items);

  return (
    <>
      <Grid ctx={ctx} cols={cols} items={items} />
      <JobGrid filter={(job) => job.status !== 'finished'} panel={true} />
    </>
  );
};
