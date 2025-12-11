import { MediaType } from '@/api/models';
import { Button } from '@/components/common/Button';
import { Css } from 'fluxio';
import {
  FolderOpenIcon,
  FolderIcon,
  FileImageIcon,
  VideoIcon,
  FileTextIcon,
  LayoutIcon,
  ListIcon,
  HelpCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from 'lucide-react';
import { DivProps } from '../common/types';

const c = Css('MediaIcon', {
  '': {
    row: ['center', 'center'],
    w: '100%',
  },
  ' span': {
    ml: 4,
  },
});

const infoByType: Record<MediaType, [string, typeof FolderOpenIcon]> = {
  content: ['Contenu', LayoutIcon],
  folder: ['Dossier', FolderIcon],
  image: ['Image', FileImageIcon],
  pdf: ['PDF', FileTextIcon],
  video: ['Video', VideoIcon],
  unknown: ['Inconnu', HelpCircleIcon],
  '': ['Inconnu', HelpCircleIcon],
};

export interface MediaIconProps extends DivProps {
  type?: MediaType;
  isOpen?: boolean;
  hasChildren?: boolean;
}

export const MediaIcon = ({ type, isOpen, hasChildren, ...props }: MediaIconProps) => {
  if (!type) return null;

  const info = infoByType[type] || infoByType.unknown;
  let Icon = info[1] || HelpCircleIcon;
  let title = info[0] || 'Inconnu';

  if (type === 'folder') {
    Icon = isOpen ? FolderOpenIcon : FolderIcon;
  }

  return (
    <div {...props} {...c('', props)}>
      <Button icon={Icon} tooltip={title} />
      {hasChildren && (
        <span>
          {isOpen ?
            <ChevronDownIcon size={12} />
          : <ChevronRightIcon size={12} />}
        </span>
      )}
    </div>
  );
};
