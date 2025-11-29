import { ArrowLeftIcon, CalendarClockIcon, CircleIcon, HomeIcon, ImageIcon, PackageIcon, SettingsIcon, SquareIcon, TextIcon, VideoIcon } from 'lucide-react';
import { useBEditController } from './useBEditController';
import { MenuButton, MenuSep } from '@/components/pages/base/Menu';
import { useRouter } from '@/hooks/useRoute';

export const BMenu = () => {
  const router = useRouter();
  const controller = useBEditController();

  return (
    <>
      <MenuSep />
      <MenuButton title="Retour" icon={ArrowLeftIcon} onClick={() => router.go({ page: 'medias' })} />
      <MenuSep />
      <MenuButton title="Paramètres" icon={SettingsIcon} onClick={() => controller.addRect()} />
      <MenuSep />
      <MenuButton title="Rectangle" icon={SquareIcon} onClick={() => controller.addRect()} />
      <MenuSep />
      <MenuButton title="Video" icon={VideoIcon} onClick={() => controller.addRect()} />
      <MenuSep />
      <MenuButton title="Image" icon={ImageIcon} onClick={() => controller.addRect()} />
      <MenuSep />
      <MenuButton title="Texte" icon={TextIcon} onClick={() => controller.addRect()} />
      <MenuSep />
      <MenuButton title="Planification" icon={CalendarClockIcon} onClick={() => controller.addRect()} />
      <MenuSep />
      <MenuButton title="Icons" icon={CircleIcon} onClick={() => controller.addRect()} />
      <MenuSep />
    </>
  );
};
