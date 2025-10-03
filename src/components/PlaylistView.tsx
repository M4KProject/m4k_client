import { Css } from '@common/ui';
import { PlaylistModel, FolderModel } from '@common/api';
import { DivProps } from '@common/components';
import { MediaConfig } from './MediaView';

const c = Css('PlaylistView', {
  '': {
    position: 'absolute',
    overflow: 'hidden',
    fCenter: 1,
    wh: '100%',
    xy: 0,
  },
});

export type PlaylistViewProps = DivProps &
  MediaConfig & {
    media?: PlaylistModel | FolderModel;
  };

export const PlaylistView = ({ media, ...props }: PlaylistViewProps) => {
  const data = media?.data || {};
  const items = data.items || (media?.deps || []).map((id) => ({ media: id }));

  return <div {...props} class={c(props)}></div>;
};
