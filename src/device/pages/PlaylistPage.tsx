import {
  Button,
  Cell,
  CellHeader,
  Div,
  Field,
  Page,
  PageBody,
  PageHeader,
  Row,
  Table,
  TableBody,
  TableHead,
  tooltip,
} from '@common/components';
import { Css, round } from '@common/helpers';
import { useCss, useMsg } from '@common/hooks';
import { Copy, Trash2 } from 'lucide-react';
import { playlist$ } from '../messages';

const css: Css = {
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
    rounded: 1,
  },
};

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

export const PlaylistPage = () => {
  const c = useCss('Playlist', css);
  const playlist = useMsg(playlist$);

  const handleDurationUpdate = (index: number, newDuration: number) => {
    if (!playlist) return;
    
    const updatedPlaylist = {
      ...playlist,
      items: playlist.items.map((item, i) => 
        i === index ? { ...item, waitMs: newDuration*1000 } : item
      )
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
        ...playlist.items.slice(index + 1)
      ]
    };
    
    playlist$.set(updatedPlaylist);
  };

  const handleDelete = (index: number) => {
    if (!playlist) return;
    
    const updatedPlaylist = {
      ...playlist,
      items: playlist.items.filter((_, i) => i !== index)
    };
    
    playlist$.set(updatedPlaylist);
  };
  return (
    <Page>
      <PageHeader title="Élément dans la playlist" />
      <PageBody>
        <Table>
          <TableHead>
            <Row>
              <CellHeader>Type</CellHeader>
              <CellHeader>Aperçu</CellHeader>
              <CellHeader>Nom du fichier</CellHeader>
              <CellHeader>Taille</CellHeader>
              <CellHeader>Format</CellHeader>
              <CellHeader>Durée (s)</CellHeader>
              <CellHeader>Actions</CellHeader>
            </Row>
          </TableHead>
          <TableBody>
            {(playlist?.items || []).map((item, i) => (
              <Row key={i}>
                <Cell>{item.mimeType}</Cell>
                <Cell cls={`${c}PreviewCell`}>
                  {item.mimeType?.startsWith('image/') && (
                    <Div
                      cls={`${c}Preview`}
                      style={{
                        backgroundImage: `url("${item.path}")`,
                      }}
                    />
                  )}
                </Cell>
                <Cell>{getFileName(item.path)}</Cell>
                <Cell>{sizeFormat(item.size)}</Cell>
                <Cell>
                  {item.width}x{item.height}
                </Cell>
                <Cell>
                  <Field
                    type="number"
                    value={round(item.waitMs/1000, 2)}
                    onValue={(waitMs) => handleDurationUpdate(i, Number(waitMs))}
                  />
                </Cell>
                <Cell variant="around">
                  <Button
                    icon={<Copy />}
                    color="primary"
                    {...tooltip('Dupliquer')}
                    onClick={() => handleDuplicate(i)}
                  />
                  <Button
                    icon={<Trash2 />}
                    color="error"
                    {...tooltip('Supprimer')}
                    onClick={() => handleDelete(i)}
                  />
                </Cell>
              </Row>
            ))}
          </TableBody>
        </Table>
      </PageBody>
    </Page>
  );
};
