import { Css } from 'fluxio';
import { Medias } from '@/components/panels/Medias';
import { Button } from '@/components/common/Button';
import { CheckIcon, Trash2Icon } from 'lucide-react';
import { createWindow } from '@/components/common/Window';

const c = Css('BMediasWindow', {
  '': {
    col: 1,
  },
  Content: {
    col: 1,
    flex: 1,
    overflow: 'auto',
  },
  Footer: {
    row: ['center', 'end'],
    bg: 'bg2',
    p: 8,
  },
});

const BMediasForm = () => {
  // const controller = useMediaController();
  // const selected = useFluxMemo(() => flux());

  const handleValidate = () => {
    console.log('Validate selected media:');
  };

  const handleDelete = () => {
    console.log('Delete selected media:');
  };

  return (
    <div {...c('')}>
      <div {...c('Content')}>
        <Medias />
      </div>
      <div {...c('Footer')}>
        <Button icon={Trash2Icon} color="error" title="Supprimer" onClick={handleDelete} />
        <Button icon={CheckIcon} color="success" title="Valider" onClick={handleValidate} />
      </div>
    </div>
  );
};

export const openBMediasWindow = (e?: Event) => {
  return createWindow({
    modal: true,
    title: 'Sélectionner un média',
    content: BMediasForm,
    target: e,
    size: [800, 600],
    min: [400, 300],
    draggable: true,
    resizable: true,
  });
};
