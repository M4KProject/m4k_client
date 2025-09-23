import { upload } from '@common/api';
import { tooltip, UploadButton } from '@common/components';
import { Upload } from 'lucide-react';

export const UploadMediaButton = () => (
  <UploadButton
    title="Téléverser"
    {...tooltip('Téléverser des medias')}
    icon={<Upload />}
    color="primary"
    onFiles={upload}
  />
);
