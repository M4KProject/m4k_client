import { Css } from '@common/ui';
import { byId, groupBy, MsgMap, sortItems } from '@common/utils';
import { addTr, useMsg } from '@common/hooks';
import { MediaModel } from '@common/api';
import { Grid, GridCols } from '@common/components';
import { JobsTable } from '../jobs/JobsTable';
import { selectedById$ } from '@/admin/controllers/selected';
import { useMedias } from '@/api/hooks';
import { useIsAdvanced } from '@/router/hooks';
import { TMap, isPositive, round } from '@common/utils';
import { Trash2, FolderInput, PlusSquare, Edit } from 'lucide-react';
import { tooltip, Button, Field } from '@common/components';
import { SelectedField } from '../SelectedField';
import { MediaPreview } from './MediaPreview';
import { updatePlaylist } from '../../controllers';
import { mediaSync } from '@/api/sync';
import { MediaIcon } from './MediaIcon';
import { updateRoute } from '@/router/setters';

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
  isAdvanced: boolean,
  selectedIds: string[],
  getTab: (id: string) => number,
  getIsOpen: (id: string) => boolean,
  setIsOpen: (id: string, isOpen: boolean) => void,
  getChildren: (id: string) => MediaModel[],
}

const cols: GridCols<MediaModel, MediaGridCtx> = {
  select: {
    w: 10,
    cls: c('Select'),
    val: ({ id }) => (
      <SelectedField id={id} />
    ),
  },
  title: {
    w: 100,
    title: 'Titre',
    val: ({ id, type, order, title }, { isAdvanced, getTab, getIsOpen, setIsOpen, getChildren }) => (
      <>
        <div style={{ width: 2 * getTab(id) + 'em' }} />
        <div onClick={() => setIsOpen(id, !getIsOpen(id))}>
          <MediaIcon type={type} isOpen={getIsOpen(id)} hasChildren={type === 'folder' && getChildren(id).length > 0} />
        </div>
        <Field
          {...(isAdvanced ? tooltip(order) : {})}
          value={title}
          onValue={(title) => mediaSync.update(id, { title })}
        />
      </>
    )
  },
  preview: {
    w: 20,
    title: 'Aperçu',
    val: media => <MediaPreview media={media} />,
  },
  size: {
    w: 20,
    title: 'Poids',
    val: ({ bytes }) => {
      if (!bytes) return '';
      const kb = bytes / 1024;
      const mb = kb / 1024;
      const gb = mb / 1024;
      if (gb > 0.95) return round(gb, 2) + 'Go';
      if (mb > 0.95) return round(mb, 2) + 'Mo';
      if (kb > 0.95) return round(kb, 2) + 'Ko';
      return bytes + 'o';
    },
  },
  resolution: {
    w: 20,
    title: 'Résolution',
    val: ({ width, height }) => (width || height) ? `${width || 0}x${height || 0}` : '',
  },
  seconds: {
    w: 10,
    title: 'Durée',
    val: ({ seconds }) => isPositive(seconds) ? round(seconds) + 's' : '',
  },
  actions: {
    w: 10,
    cls: c('Actions'),
    val: ({ id, key, type }, { selectedIds, getChildren }) => (
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
        <Button
          icon={<Trash2 />}
          color="error"
          {...tooltip('Supprimer')}
          onClick={async () => {
            for (const c of getChildren(id)) {
              mediaSync.update(c.id, { parent: null });
            }
            mediaSync.delete(id);
          }}
        />
      </>
    ),
  },
};

const openById$ = new MsgMap<boolean>({});

export const MediaTable = ({ type }: { type?: MediaModel['type'] }) => {
  const medias = useMedias();
  const openById = useMsg(openById$);
  const isAdvanced = useIsAdvanced();
  const allSelectedById = useMsg(selectedById$);
  const mediaById = byId(medias);
  const mediasByParent = groupBy(medias, (m) => mediaById[m.parent]?.id || '');
  const selectedIds = Object.keys(allSelectedById).filter((id) => mediaById[id]);

  const tabById: TMap<number> = {};
  const rootMedias = (type ? medias.filter((m) => m.type === type) : mediasByParent['']) || [];

  const items: MediaModel[] = [];

  const deep = (medias: MediaModel[], tab: number) => {
    sortItems(medias, (m) => m.title);
    for (const media of medias) {
      const id = media.id;
      items.push(media);
      tabById[id] = tab;
      if (openById[id]) {
        const children = mediasByParent[id];
        if (children) deep(children, tab + 1);
      }
    }
  }
  deep(rootMedias, 0);

  const ctx: MediaGridCtx = {
    isAdvanced,
    selectedIds,
    getChildren: (id) => mediasByParent[id] || [],
    getIsOpen: (id) => openById[id] || false,
    setIsOpen: (id, isOpen) => openById$.setItem(id, isOpen),
    getTab: (id) => tabById[id] || 0,
  };

  console.debug('MediaTable', ctx, items);

  return (
    <>
      <Grid ctx={ctx} cols={cols} items={items} />
      <JobsTable filter={(job) => job.status !== 'finished'} panel={true} />
    </>
  );
};
