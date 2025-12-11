import {
  ArrowLeftIcon,
  EarthIcon,
  FileSlidersIcon,
  FilterIcon,
  ListTreeIcon,
  TextIcon,
} from 'lucide-react';
import { useBEditController } from './useBEditController';
import { useRouter } from '@/hooks/useRoute';
import { useFlux } from '@/hooks/useFlux';
import { Button, ButtonProps } from '@/components/common/Button';
import { BEditSideName } from './BEditController';
import { PlayerIcon } from '../BController';

export interface BMenuButtonProps extends ButtonProps {
  name?: BEditSideName;
}

export const BMenuButton = ({ name, ...props }: BMenuButtonProps) => {
  const controller = useBEditController();
  const selected = useFlux(controller?.side$.map((p) => p === name));
  // console.debug('BMenuButton', { controller, page, selected });

  const handle = (e: Event) => {
    const side$ = controller.side$;
    if (props.onClick) props.onClick(e);
    if (name && side$) side$.set((p) => (p === name ? '' : name));

    // switch(page) {
    //   case 'screen':
    //     controller.selectIndex$.set(0);
    //     break;
    //   case 'page':
    //     controller.selectIndex$.set(index => controller.getPage(index)?.i || 0);
    //     break;
    // }
  };

  return <Button {...props} selected={selected} onClick={handle} tooltip={name} />;
};

export const BMenu = () => {
  const controller = useBEditController();
  const router = useRouter();

  return (
    <>
      <BMenuButton
        title="Retour"
        icon={ArrowLeftIcon}
        onClick={() => router.go({ page: 'medias' })}
      />
      <BMenuButton title="Liste" icon={ListTreeIcon} name="tree" />
      <BMenuButton title="Player" icon={PlayerIcon} name="media" />
      <BMenuButton title="Vue Web" icon={EarthIcon} name="web" />
      <BMenuButton title="Texte" icon={TextIcon} name="text" />
      <BMenuButton title="Filtrer" icon={FilterIcon} name="filter" />
      <BMenuButton title="Avancé" icon={FileSlidersIcon} name="advanced" />
    </>
  );
};
