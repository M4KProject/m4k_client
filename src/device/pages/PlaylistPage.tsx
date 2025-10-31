import { Button, Field, Grid, Page, PageBody, Toolbar, tooltip } from '@common/components';
import { GridCols } from '@common/components/Grid';
import { Css } from '@common/ui';
import { round } from 'fluxio';
import { useFlux } from '@common/hooks';
import { ArrowUp, ArrowDown, Copy, Trash2 } from 'lucide-react';
import { playlist$ } from '../messages';

const c = Css('Playlist', {
  Preview: {
    position: 'absolute',
    xy: '50%',
    wh: '100%',
    translate: '-50%, -50%',
    bgMode: 'contain',
    transition: 0.2,
    userSelect: 'none',
    pointerEvents: 'none',
  },
  'PreviewCell:hover &Preview': {
    xy: '50%',
    wh: 15,
    zIndex: 1,
    translate: '-50%, -50%',
    rounded: 1,
  },
});

const sizeFormat = (size?: number) => {
  if (!size) return '';
  const kb = size / 1024;
  const mb = kb / 1024;
  const gb = mb / 1024;
  if (gb > 0.95) return Math.round(gb * 100) / 100 + 'Go';
  if (mb > 0.95) return Math.round(mb * 100) / 100 + 'Mo';
  if (kb > 0.95) return Math.round(kb * 100) / 100 + 'Ko';
  return size + 'o';
};

const getFileName = (path?: string) => {
  if (!path) return '';
  return path.split('/').pop() || path;
};

interface PlaylistItem {
  mimeType?: string;
  path?: string;
  size?: number;
  width?: number;
  height?: number;
  waitMs: number;
}

const playlistItemCols: GridCols<
  PlaylistItem,
  {
    handleDurationUpdate: (index: number, duration: number) => void;
    handleMoveUp: (index: number) => void;
    handleMoveDown: (index: number) => void;
    handleDuplicate: (index: number) => void;
    handleDelete: (index: number) => void;
    playlist: any;
  }
> = {
  mimeType: ['Type', (item) => item.mimeType],
  preview: [
    'Aperçu',
    (item) =>
      item.mimeType?.startsWith('image/') && (
        <div
          {...c('Preview')}
          style={{
            backgroundImage: `url("${item.path}")`,
          }}
        />
      ),
    { cls: c('PreviewCell') },
  ],
  filename: ['Nom du fichier', (item) => getFileName(item.path)],
  size: ['Taille', (item) => sizeFormat(item.size)],
  format: ['Format', (item) => `${item.width}x${item.height}`],
  duration: [
    'Durée (s)',
    (item, ctx, i) => (
      <Field
        type="number"
        value={round(item.waitMs / 1000, 2)}
        onValue={(waitMs) => ctx.handleDurationUpdate(i, Number(waitMs))}
      />
    ),
  ],
  actions: [
    'Actions',
    (_item, ctx, i) => (
      <div style={{ display: 'flex', gap: '0.5em' }}>
        <Button
          icon={<ArrowUp />}
          color="primary"
          {...tooltip(i === 0 ? 'Aller à la fin' : 'Monter')}
          onClick={() => ctx.handleMoveUp(i)}
        />
        <Button
          icon={<ArrowDown />}
          color="primary"
          {...tooltip(
            i === (ctx.playlist?.items?.length || 0) - 1 ? 'Aller au début' : 'Descendre'
          )}
          onClick={() => ctx.handleMoveDown(i)}
        />
        <Button
          icon={<Copy />}
          color="primary"
          {...tooltip('Dupliquer')}
          onClick={() => ctx.handleDuplicate(i)}
        />
        <Button
          icon={<Trash2 />}
          color="error"
          {...tooltip('Supprimer')}
          onClick={() => ctx.handleDelete(i)}
        />
      </div>
    ),
  ],
};

export const PlaylistPage = () => {
  const playlist = useFlux(playlist$);

  const handleDurationUpdate = (index: number, newDuration: number) => {
    if (!playlist) return;

    const updatedPlaylist = {
      ...playlist,
      items: playlist.items.map((item, i) =>
        i === index ? { ...item, waitMs: newDuration * 1000 } : item
      ),
    };

    playlist$.set(updatedPlaylist);
  };

  const handleDuplicate = (index: number) => {
    if (!playlist) return;

    const itemToDuplicate = playlist.items[index];
    const updatedPlaylist = {
      ...playlist,
      items: [
        ...playlist.items.slice(0, index + 1),
        { ...itemToDuplicate },
        ...playlist.items.slice(index + 1),
      ],
    };

    playlist$.set(updatedPlaylist);
  };

  const handleDelete = (index: number) => {
    if (!playlist) return;

    const updatedPlaylist = {
      ...playlist,
      items: playlist.items.filter((_, i) => i !== index),
    };

    playlist$.set(updatedPlaylist);
  };

  const handleMoveUp = (index: number) => {
    if (!playlist) return;

    const items = [...playlist.items];
    const item = items[index];

    if (index === 0) {
      // Premier élément : déplacer à la fin
      items.splice(index, 1);
      items.push(item);
    } else {
      // Échanger avec l'élément précédent
      [items[index - 1], items[index]] = [items[index], items[index - 1]];
    }

    const updatedPlaylist = {
      ...playlist,
      items,
    };

    playlist$.set(updatedPlaylist);
  };

  const handleMoveDown = (index: number) => {
    if (!playlist) return;

    const items = [...playlist.items];
    const item = items[index];

    if (index === playlist.items.length - 1) {
      // Dernier élément : déplacer au début
      items.splice(index, 1);
      items.unshift(item);
    } else {
      // Échanger avec l'élément suivant
      [items[index], items[index + 1]] = [items[index + 1], items[index]];
    }

    const updatedPlaylist = {
      ...playlist,
      items,
    };

    playlist$.set(updatedPlaylist);
  };
  return (
    <Page>
      <Toolbar title="Élément dans la playlist" />
      <PageBody>
        <Grid
          cols={playlistItemCols}
          ctx={{
            handleDurationUpdate,
            handleMoveUp,
            handleMoveDown,
            handleDuplicate,
            handleDelete,
            playlist,
          }}
          items={playlist?.items || []}
        />
      </PageBody>
    </Page>
  );
};
