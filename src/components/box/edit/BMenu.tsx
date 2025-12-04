import {
  ArrowLeftIcon,
  EarthIcon,
  FileIcon,
  FileSlidersIcon,
  ImagePlayIcon,
  MonitorSmartphoneIcon,
} from 'lucide-react';
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
  const selected = useFlux(controller?.page$.map((p) => p === page));
  // console.debug('BMenuButton', { controller, page, selected });

  const handle = (e: Event) => {
    const page$ = controller?.page$;
    if (props.onClick) props.onClick(e);
    if (page && page$) page$.set(prev => prev === page ? '' : page);
  };

  return <Button {...props} selected={selected} onClick={handle} />;
};

export const BMenu = () => {
  const router = useRouter();

  return (
    <>
      <BMenuButton
        title="Retour"
        icon={ArrowLeftIcon}
        onClick={() => router.go({ page: 'medias' })}
      />
      <BMenuButton title="Écran" icon={MonitorSmartphoneIcon} page="screen" />
      <BMenuButton title="Page" icon={FileIcon} page="page" />
      <BMenuButton title="Médias" icon={ImagePlayIcon} page="playlist" />
      <BMenuButton title="Page Web" icon={EarthIcon} page="webview" />
      <BMenuButton title="Avancé" icon={FileSlidersIcon} page="advanced" />
      {/* <BMenuButton title="Filtrer" icon={CalendarClockIcon} page="planification" /> */}
      {/* <MenuSep /> */}
      {/* <BMenuButton title="Zone" icon={LayoutIcon} page="layout" /> */}
      {/* <BMenuButton title="Media" icon={ImageIcon} page="media" /> */}
    </>
  );
};
