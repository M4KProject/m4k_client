import { Dict, isPositive, round } from '@common/utils';
import { Trash2, FolderInput, PlusSquare, Edit } from 'lucide-react';
import { MediaModel } from '@common/api';
import { tooltip, Button, Row, Cell, Field } from '@common/components';
import { SelectedField } from '../SelectedField';
import { MediaPreview } from './MediaPreview';
import { updatePlaylist } from '../../controllers';
import { mediaSync } from '@/api/sync';
import { useState } from 'preact/hooks';
import { MediaIcon } from './MediaIcon';
import { updateRoute } from '@/router/setters';
import { selectedById$ } from '@/admin/controllers/selected';

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
  const { isAdvanced, selectedIds, mediasByParent } = ctx;
  const children = mediasByParent[m.id] || [];
  const hasChildren = m.type === 'folder' && children.length > 0;

  if (m.title.startsWith('.') && !isAdvanced) return null;

  return (
    <>
      <Row key={m.id}>
        <Cell variant="check">
          <SelectedField id={m.id} />
        </Cell>
        <Cell variant="row">
          <div style={{ width: 2 * tab + 'em' }} />
          <div onClick={() => setIsOpen((o) => !o)}>
            <MediaIcon type={m.type} isOpen={isOpen} hasChildren={hasChildren} />
          </div>
          <Field
            {...(isAdvanced ? tooltip(m.order) : {})}
            value={m.title}
            onValue={(title) => mediaSync.update(m.id, { title })}
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
                  await mediaSync.update(id, { parent: m.id });
                }
              }}
            />
          )}
          {m.type === 'playlist' && (
            <>
              <Button
                icon={<Edit />}
                {...tooltip(`Configurer la playlist`)}
                onClick={() => {
                  updateRoute({
                    page: 'medias',
                    mediaType: 'playlist',
                    mediaKey: m.key,
                    isEdit: true,
                  });
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
                mediaSync.update(c.id, { parent: null });
              }
              mediaSync.delete(m.id);
            }}
          />
        </Cell>
      </Row>
      {isOpen &&
        hasChildren &&
        children.map((child) => <MediaRow key={child.id} m={child} ctx={ctx} tab={tab + 1} />)}
    </>
  );
};
