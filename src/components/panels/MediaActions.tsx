import { useFlux } from '@/hooks/useFlux';
import { useMediaController } from '@/hooks/useMediaController';
import { Button, UploadButton } from '../common/Button';
import { EditIcon, FolderPlusIcon, LayoutIcon, TrashIcon, UploadIcon } from 'lucide-react';
import { Actions, ActionsSep } from './base/Actions';
import { Field } from '../fields/Field';

export const MediasActions = () => {
  const controller = useMediaController();
  const select = useFlux(controller.select$);
  const parent = useFlux(controller.parent$);
  return (
    <Actions>
      <UploadButton
        color="primary"
        icon={UploadIcon}
        title="Upload"
        tooltip="Téléverser des medias"
        onFiles={controller.upload}
      />
      <Button
        color="primary"
        icon={FolderPlusIcon}
        title="Ajouter Dossier"
        tooltip="Créer un nouveau dossier"
        onClick={controller.addFolder}
      />
      <Button
        color="primary"
        icon={LayoutIcon}
        title="Ajouter Contenu"
        onClick={controller.addContent}
      />
      <ActionsSep />
      {parent && (
        <Field label="Nom du dossier" value={parent.title} onValue={title => controller.update(parent, { title })} />
      )}
      <ActionsSep />
      {select && (
        <Button
          color="primary"
          icon={EditIcon}
          title="Modifier"
          onClick={controller.edit}
        />
      )}
      {select && (
        <Button
          color="error"
          icon={TrashIcon}
          title="Supprimer"
          onClick={controller.delete}
        />
      )}
    </Actions>
  );
}
