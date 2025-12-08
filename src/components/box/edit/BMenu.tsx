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
import { BEditPage } from './BEditController';
import { PlayerIcon } from '../BController';

export interface BMenuButtonProps extends ButtonProps {
  page?: BEditPage;
}

export const BMenuButton = ({ page, ...props }: BMenuButtonProps) => {
  const controller = useBEditController()!;
  const selected = useFlux(controller?.page$.map((p) => p === page));
  // console.debug('BMenuButton', { controller, page, selected });

  const handle = (e: Event) => {
    const page$ = controller.page$;
    if (props.onClick) props.onClick(e);
    if (page && page$) page$.set((prev) => (prev === page ? '' : page));

    // switch(page) {
    //   case 'screen':
    //     controller.selectIndex$.set(0);
    //     break;
    //   case 'page':
    //     controller.selectIndex$.set(index => controller.getPage(index)?.i || 0);
    //     break;
    // }
  };

  return <Button {...props} selected={selected} onClick={handle} tooltip={page} />;
};

export const BMenu = () => {
  const controller = useBEditController();
  const router = useRouter();

  return controller ? (
    <>
      <BMenuButton
        title="Retour"
        icon={ArrowLeftIcon}
        onClick={() => router.go({ page: 'medias' })}
      />
      <BMenuButton title="Liste" icon={ListTreeIcon} page="tree" />
      <BMenuButton title="Player" icon={PlayerIcon} page="player" />
      <BMenuButton title="Vue Web" icon={EarthIcon} page="webview" />
      <BMenuButton title="Texte" icon={TextIcon} page="text" />
      <BMenuButton title="Filtrer" icon={FilterIcon} page="filter" />
      <BMenuButton title="Avancé" icon={FileSlidersIcon} page="advanced" />
    </>
  ) : null;
};
