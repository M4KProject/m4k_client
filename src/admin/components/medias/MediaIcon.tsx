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
import { MediaType } from '@/api';
import { tooltip } from '@common/components';

const c = Css('MediaIcon', {
  '': {
    fRow: ['center', 'center'],
    w: '100%',
  },
  ' span': {
    ml: 0.5,
  },
});

const infoByType: Record<MediaType, [string, typeof FolderOpen]> = {
  playlist: ['Playlist', List],
  folder: ['Dossier', Folder],
  image: ['Image', FileImage],
  pdf: ['PDF', FileText],
  video: ['Video', Video],
  page: ['Page', Layout],
  unknown: ['Inconnu', HelpCircle],
  '': ['Inconnu', HelpCircle],
};

export interface MediaIconProps {
  type?: MediaType;
  isOpen?: boolean;
  hasChildren?: boolean;
}

export const MediaIcon = ({ type, isOpen, hasChildren }: MediaIconProps) => {
  if (!type) return null;

  const info = infoByType[type] || infoByType.unknown;
  let Icon = info[1] || HelpCircle;
  let title = info[0] || 'Inconnu';

  if (type === 'folder') {
    Icon = isOpen ? FolderOpen : Folder;
  }

  return (
    <div {...c()}>
      <Icon {...tooltip(title)} />
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
