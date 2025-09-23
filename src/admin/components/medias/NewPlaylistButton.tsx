import { MapPlus } from 'lucide-react';
import { needAuthId, needGroupId } from '@common/api';
import { tooltip, Button } from '@common/components';
import { mediaCtrl } from '../../controllers';
import { getNextTitle } from '../../controllers/getNextTitle';

export const NewPlaylistButton = () => (
  <Button
    icon={<MapPlus />}
    {...tooltip('Créer une playlist')}
    onClick={() => {
      mediaCtrl.create({
        title: getNextTitle('Playlist'),
        mime: 'application/playlist',
        type: 'playlist',
        user: needAuthId(),
        group: needGroupId(),
      });
    }}
  >
    Ajouter Playlist
  </Button>
);
