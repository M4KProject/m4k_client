import { FolderPlus } from 'lucide-react';
import { needAuthId, needGroupId } from '@common/api';
import { tooltip, Button } from '@common/components';
import { mediaCtrl } from '../../controllers';
import { getNextTitle } from '../../controllers/getNextTitle';

export const NewFolderButton = () => (
  <Button
    icon={<FolderPlus />}
    {...tooltip('Créer un nouveau dossier')}
    onClick={() => {
      mediaCtrl.create({
        title: getNextTitle('Dossier'),
        mime: 'application/folder',
        type: 'folder',
        user: needAuthId(),
        group: needGroupId(),
      });
    }}
  >
    Nouveau dossier
  </Button>
);
