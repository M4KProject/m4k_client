import { ArrowLeftIcon, CalendarClockIcon, ExpandIcon, GalleryHorizontalIcon, ImageIcon, SettingsIcon, TextIcon } from 'lucide-react';
import { useBEditController } from './useBEditController';
import { useRouter } from '@/hooks/useRoute';
import { useFlux } from '@/hooks/useFlux';
import { Button, ButtonProps } from '@/components/common/Button';
import { BEditPage } from './BEditController';

export interface BMenuButtonProps extends ButtonProps {
  page?: BEditPage;
}

export const BMenuButton = ({ page, ...props }: BMenuButtonProps) => {
  const controller = useBEditController();
  const selected = useFlux(controller?.page$.map(p => p === page));
  console.debug('BMenuButton', { controller, page, selected });

  const handle = (e: Event) => {
    if (props.onClick) props.onClick(e);
    if (page) {
      controller?.page$.set(page);
    }
  }

  return (
    <Button
      {...props}
      selected={selected}
      onClick={handle}
    />
  );
};

export const BMenu = () => {
  const router = useRouter();
  const controller = useBEditController();

  return (
    <>
      <BMenuButton title="Retour" icon={ArrowLeftIcon} onClick={() => router.go({ page: 'medias' })} />
      <BMenuButton title="Paramètres" icon={SettingsIcon} page="settings" />
      <BMenuButton title="Position" icon={ExpandIcon} page="layout" />
      <BMenuButton title="Media" icon={ImageIcon} page="media" />
      <BMenuButton title="Texte" icon={TextIcon} page="text" />
      <BMenuButton title="Carrousel" icon={GalleryHorizontalIcon} page="carrousel" />
      <BMenuButton title="Planification" icon={CalendarClockIcon} page="planification" />
    </>
  );
};
