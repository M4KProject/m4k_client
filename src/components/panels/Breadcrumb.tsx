import { useFlux } from '@/hooks/useFlux';
import { useMediaController } from '@/hooks/useMediaController';
import { Button, UploadButton } from '../common/Button';
import {
  EditIcon,
  FolderPlusIcon,
  HomeIcon,
  LayoutIcon,
  TrashIcon,
  UploadIcon,
} from 'lucide-react';
import { DivProps } from '@/components/common/types';
import { Css } from 'fluxio';
import { Field } from '../fields/Field';
import { Fragment } from 'preact/jsx-runtime';

const c = Css('Breadcrumb', {
  '': {
    rowWrap: 1,
    w: '100%',
    bg: 'bg',
    elevation: 1,
    rounded: 5,
  },
  ' .Button': {
    m: 4,
    wMax: 350,
  },
  NavButton: {
    m: 4,
  },
  Sep: {
    mx: 2,
    opacity: 0.5,
  },
  Flex: {
    flex: 1,
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
});

export interface ActionsProps extends DivProps {}

const Sep = (props: DivProps) => (
  <div {...props} {...c('Sep', props)}>
    /
  </div>
);

const Flex = (props: DivProps) => <div {...props} {...c('Flex', props)} />;

export const Breadcrumb = ({ children, ...props }: ActionsProps) => {
  const controller = useMediaController();
  const select = useFlux(controller.select$);
  const breadcrumb = useFlux(controller.breadcrumb$);

  return (
    <div {...props} {...c('', props)}>
      <Button
        {...c('NavButton')}
        icon={HomeIcon}
        onClick={() => controller.select$.set(undefined)}
        tooltip="Retour à la racine"
      />
      {breadcrumb
        .filter((m) => m !== select)
        .map((node) => (
          <Fragment key={node.id}>
            <Sep />
            <Button {...c('NavButton')} title={node.title} onClick={controller.click(node)} />
          </Fragment>
        ))}
      {select && (
        <>
          <Sep />
          <Field
            key={select.id}
            value={select.title}
            onValue={(title) => controller.update(select, { title })}
            props={{ size: Math.max(1, (select.title?.length || 0) + 2) }}
          />
          <Button color="error" icon={TrashIcon} title="Supprimer" onClick={controller.delete} />
        </>
      )}

      <Flex />
      {(!select || select?.type === 'folder') && (
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
      {select?.type === 'content' && (
        <>
          <Button
            color="primary"
            icon={EditIcon}
            title="Modifier la Page"
            onClick={controller.edit}
          />
        </>
      )}
    </div>
  );
};
