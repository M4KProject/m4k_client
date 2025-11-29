import { MediaType } from '@/api/models';
import { Button } from '@/components/common/Button';
import { Css } from 'fluxio';
import {
  FolderOpen,
  Folder,
  FileImage,
  Video,
  FileText,
  Layout,
  List,
  HelpCircle,
  ChevronDown,
  ChevronRight,
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

const infoByType: Record<MediaType, [string, typeof FolderOpen]> = {
  content: ['Contenu', Layout],
  folder: ['Dossier', Folder],
  image: ['Image', FileImage],
  pdf: ['PDF', FileText],
  video: ['Video', Video],
  unknown: ['Inconnu', HelpCircle],
  '': ['Inconnu', HelpCircle],
};

export interface MediaIconProps extends DivProps {
  type?: MediaType;
  isOpen?: boolean;
  hasChildren?: boolean;
}

export const MediaIcon = ({ type, isOpen, hasChildren, ...props }: MediaIconProps) => {
  if (!type) return null;

  const info = infoByType[type] || infoByType.unknown;
  let Icon = info[1] || HelpCircle;
  let title = info[0] || 'Inconnu';

  if (type === 'folder') {
    Icon = isOpen ? FolderOpen : Folder;
  }

  return (
    <div {...props} {...c('', props)}>
      <Button icon={Icon} tooltip={title} />
      {hasChildren && (
        <span>
          {isOpen ?
            <ChevronDown size={12} />
          : <ChevronRight size={12} />}
        </span>
      )}
    </div>
  );
};
