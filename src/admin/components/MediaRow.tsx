import { Dict, isPositive, round } from '@common/utils';
import { mediaId$, adminPage$, selectedById$ } from '../messages';
import { Trash2, FolderInput, PlusSquare, Settings } from 'lucide-react';
import { MediaModel } from '@common/api';
import { tooltip, Button, Row, Cell, Field } from '@common/components';
import { SelectedField } from './SelectedField';
import { MediaPreview } from './MediaPreview';
import { mediaCtrl, updatePlaylist } from '../controllers';
import { useState } from 'preact/hooks';
import { MediaIcon } from './MediaIcon';

export interface MediaCtx {
  mediaById: Dict<MediaModel>;
  mediasByParent: Dict<MediaModel[]>;
  isAdvanced: boolean;
  selectedIds: string[];
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
};

const secondsFormat = (s?: number) => (isPositive(s) ? round(s) + 's' : '');

export const MediaRow = ({ m, ctx, tab }: { m: MediaModel; ctx: MediaCtx; tab: number }) => {
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
            <MediaIcon
              type={m.type}
              isOpen={isOpen}
              hasChildren={deps.length > 0 || children.length > 0}
            />
          </div>
          <Field
            {...(isAdvanced ? tooltip(m.order) : {})}
            value={m.title}
            onValue={(title) => mediaCtrl.update(m.id, { title })}
          />
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
                onClick={() => {
                  mediaId$.set(m.id);
                  adminPage$.set('playlists');
                }}
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
        </Cell>
      </Row>
      {isOpen &&
        children.map((child) => <MediaRow key={child.id} m={child} ctx={ctx} tab={tab + 1} />)}
      {isOpen && deps.map((child) => <MediaRow key={child.id} m={child} ctx={ctx} tab={tab + 1} />)}
    </>
  );
};
