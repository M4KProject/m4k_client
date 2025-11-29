import { useFlux } from '@/hooks/useFlux';
import { useMediaController } from '@/hooks/useMediaController';
import { Button, UploadButton } from '../common/Button';
import { FolderPlusIcon, LayoutIcon, UploadIcon } from 'lucide-react';
import { Field } from '../fields/Field';
import { DivProps } from '@/components/common/types';
import { Css } from 'fluxio';

const c = Css('MediaBreadcrumb', {
  '': {
    rowWrap: 1,
    w: '100%',
    bg: 'bg',
    elevation: 1,
    rounded: 5,
  },
  ' .Button, .Field': {
    m: 4,
    wMax: 350,
  },
  ' .Field': {
    w: 'fit-content',
  },
  ' .FieldContent': {
    w: 'fit-content',
    flex: 'unset',
  },
  ' .Field input': {
    w: 'fit-content',
    wMin: 60,
    border: 0,
  },
  Sep: {
    flex: 1,
  },
  ' .FieldLabel': {
    wMax: 150,
  },
});

export interface ActionsProps extends DivProps {

}

const Sep = (props: DivProps) => (
  <div {...props} {...c('Sep', props)} />
);

export const MediaBreadcrumb = ({ children, ...props }: ActionsProps) => {
  const controller = useMediaController();
  const select = useFlux(controller.select$);
  const breadcrumb = useFlux(controller.breadcrumb$);

  return (
    <div {...props} {...c('', props)}>
      {breadcrumb.map((node, i) => (
        <>
          {i ? <div>/</div> : null}
          <Field
            value={node.title}
            onValue={title => controller.update(node, { title })}
            props={{ size: Math.max(1, node.title?.length || 0) }}
          />
        </>
      ))}
      <Sep />
      {!select || select?.type === 'folder' && (
        <>
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
        </>
      )}
      {/* <ActionsSep />
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
      )} */}
    </div>
  );
}
