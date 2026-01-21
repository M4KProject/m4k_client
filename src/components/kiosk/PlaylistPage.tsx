import { Css } from 'fluxio';
import { round } from 'fluxio';
import { ArrowUpIcon, ArrowDownIcon, CopyIcon, Trash2Icon } from 'lucide-react';
import { Grid, GridCols } from '@/components/common/Grid';
import { Field } from '@/components/fields/Field';
import { Button } from '@/components/common/Button';
import { useFlux } from '@/hooks/useFlux';
import { Panel } from '../panels/base/Panel';
import { kPlaylist$, PlaylistItem } from '@/controllers/Kiosk';

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
    rounded: 3,
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
  mimeType: ['Type', (item) => item.mimeType, { w: 60 }],
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
    { cls: c('PreviewCell'), flex: 1 },
  ],
  filename: ['Nom du fichier', (item) => getFileName(item.path), { flex: 2 }],
  size: ['Taille', (item) => sizeFormat(item.size), { w: 70 }],
  format: ['Format', (item) => `${item.width}x${item.height}`, { w: 70 }],
  duration: [
    'Durée (s)',
    (item, ctx, i) => (
      <Field
        type="number"
        value={round((item.waitMs||5000) / 1000, 2)}
        onValue={(waitMs) => ctx.handleDurationUpdate(i, Number(waitMs))}
      />
    ), { w: 80 }
  ],
  actions: [
    'Actions',
    (_item, ctx, i) => (
      <div style={{ display: 'flex', gap: '0.5em' }}>
        <Button
          icon={ArrowUpIcon}
          color="primary"
          tooltip={i === 0 ? 'Aller à la fin' : 'Monter'}
          onClick={() => ctx.handleMoveUp(i)}
        />
        <Button
          icon={ArrowDownIcon}
          color="primary"
          tooltip={i === (ctx.playlist?.items?.length || 0) - 1 ? 'Aller au début' : 'Descendre'}
          onClick={() => ctx.handleMoveDown(i)}
        />
        <Button
          icon={CopyIcon}
          color="primary"
          tooltip="Dupliquer"
          onClick={() => ctx.handleDuplicate(i)}
        />
        <Button
          icon={Trash2Icon}
          color="error"
          tooltip="Supprimer"
          onClick={() => ctx.handleDelete(i)}
        />
      </div>
    ), { w: 70 }
  ]
};

export const PlaylistPage = () => {
  const playlist = useFlux(kPlaylist$) || {};
  const pItems = playlist?.items || [];

  const handleDurationUpdate = (index: number, newDuration: number) => {
    if (!playlist) return;

    const updatedPlaylist = {
      ...playlist,
      items: pItems.map((item, i) =>
        i === index ? { ...item, waitMs: newDuration * 1000 } : item
      ),
    };

    kPlaylist$.set(updatedPlaylist);
  };

  const handleDuplicate = (index: number) => {
    if (!playlist) return;

    const itemToDuplicate = pItems[index];
    if (!itemToDuplicate) return;

    const updatedPlaylist = {
      ...playlist,
      items: [
        ...pItems.slice(0, index + 1),
        { ...itemToDuplicate },
        ...pItems.slice(index + 1),
      ],
    };

    kPlaylist$.set(updatedPlaylist);
  };

  const handleDelete = (index: number) => {
    if (!playlist) return;

    const updatedPlaylist = {
      ...playlist,
      items: pItems.filter((_, i) => i !== index),
    };

    kPlaylist$.set(updatedPlaylist);
  };

  const handleMoveUp = (index: number) => {
    if (!playlist) return;

    const items = [...pItems];
    const item = items[index];
    if (!item) return;

    if (index === 0) {
      items.splice(index, 1);
      items.push(item);
    } else {
      const a = items[index];
      const b = items[index - 1];
      if (!a) return;
      if (!b) return;
      items[index - 1] = a;
      items[index] = b;
    }

    const updatedPlaylist = {
      ...playlist,
      items,
    };

    kPlaylist$.set(updatedPlaylist);
  };

  const handleMoveDown = (index: number) => {
    if (!playlist) return;

    const items = [...pItems];
    const item = items[index];
    if (!item) return;

    if (index === pItems.length - 1) {
      items.splice(index, 1);
      items.unshift(item);
    } else {
      const a = items[index];
      const b = items[index - 1];
      if (!a) return;
      if (!b) return;
      items[index - 1] = a;
      items[index] = b;
    }

    const updatedPlaylist = {
      ...playlist,
      items,
    };

    kPlaylist$.set(updatedPlaylist);
  };
  return (
    <Panel icon={null} title="Élément dans la playlist">
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
        items={pItems}
      />
    </Panel>
  );
};
